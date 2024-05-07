// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import {
	StorageReference,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCB9A2c2fN-ssRLKlaeIgnOCfrFALn6ghw",
	authDomain: "explain-the-pdf.firebaseapp.com",
	projectId: "explain-the-pdf",
	storageBucket: "explain-the-pdf.appspot.com",
	messagingSenderId: "948431623952",
	appId: "1:948431623952:web:321d911965fca9300b3795",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadToFirestore(file: File) {
	try {
		const file_key = `uploads/${Date.now().toString()}${file.name.replace(
			" ",
			"-"
		)}`;
		const fileRef = ref(storage, file_key);
		uploadBytesResumable(fileRef, file).then((snapshot) => {
			console.log("Uploaded a blob or file!");
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log(progress);
		});
		return Promise.resolve({ file_key, file_name: file.name, fileRef });
	} catch (e) {
		console.error("Error adding document: ", e);
	}
}

export async function getFileUrl(fileRef: StorageReference) {
	let fileUrl = "";
	await getDownloadURL(fileRef).then((url) => {
		fileUrl = url;
	});
	return Promise.resolve(fileUrl);
}
