import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from "./config";

const storage = getStorage(firebaseApp);

export const uploadWebfile = async (
  userId: string,
  file: File,
  recordId: string,
) => {
  const fileRef = ref(
    storage,
    `users/${userId}/webfiles/${recordId}/${file.name}`,
  );
  const snapshot = await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
};
