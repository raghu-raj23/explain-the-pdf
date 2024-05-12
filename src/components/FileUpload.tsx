"use client";

import { getFileUrl, uploadToFirestore } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { StorageReference } from "firebase/storage";
import toast from "react-hot-toast";

type Props = {};

const FileUpload = (props: Props) => {
	const [uploading, setUploading] = useState(false);
	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			file_key,
			file_name,
			fileRef,
		}: {
			file_key: string;
			file_name: string;
			fileRef: StorageReference;
		}) => {
			const response = await axios.post("/api/create-chat", {
				file_key,
				file_name,
				fileRef,
			});
			return response.data;
		},
	});

	const { getRootProps, getInputProps } = useDropzone({
		accept: { "application/pdf": [".pdf"] },
		maxFiles: 1,
		onDrop: async (acceptedFiles) => {
			const file = acceptedFiles[0];
			if (file.size > 10 * 1024 * 1024) {
				// alert("Please upload a smaller file");
				toast.error("File too large");
				return;
			}
			try {
				setUploading(true);
				const data = await uploadToFirestore(file);
				if (!data?.file_key || !data?.fileRef) {
					toast.error("Something went wrong!");
					return;
				}
				mutate(data, {
					onSuccess: (data) => {
						console.log(data);
						toast.success(data.message)
					},
					onError: (error) => {
						toast.error("Error creating chat!");
					},
				});
				console.log("data", data);
			} catch (error) {
				console.log(error);
			} finally {
				setUploading(false);
			}
		},
	});
	return (
		<div className="p-2 bg-white rounded-xl">
			<div
				{...getRootProps({
					className:
						"border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
				})}>
				<input {...getInputProps()} />
				{uploading || isPending ? (
					<>
						<Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
						<p className="mt-2 text-sm text-slate-400">
							Spilling tea to GPT ...
						</p>
					</>
				) : (
					<>
						<Inbox className="w-10 h-10 text-blue-500" />
						<p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
					</>
				)}
			</div>
		</div>
	);
};

export default FileUpload;
