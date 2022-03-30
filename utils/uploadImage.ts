type UploadPreset = "dogruns_dogs" | "dogruns_parks"

export default async function uploadImage(images: File[], uploadPreset: UploadPreset){
  const formData = new FormData();
        formData.append("file", (images as any)[0]);
        formData.append("upload_preset", uploadPreset);

        const cloudinaryData = await fetch(
          "https://api.cloudinary.com/v1_1/chadmuro/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const response = await cloudinaryData.json();
  return response.secure_url;
}