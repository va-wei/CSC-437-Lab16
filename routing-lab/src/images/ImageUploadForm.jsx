import { useId, useState, useActionState } from "react";

export function ImageUploadForm() {
	const fileInputId = useId();
	const [previewSrc, setPreviewSrc] = useState(null);

	function readAsDataURL(file) {
		return new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = () => resolve(fr.result);
			fr.onerror = (err) => reject(err);
			fr.readAsDataURL(file);
		});
	}

	async function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (file) {
			const dataURL = await readAsDataURL(file);
			setPreviewSrc(dataURL);
		}
	}

	async function uploadImage(prevState, formData) {
		const imageFile = formData.get("image");
		const imageTitle = formData.get("name");

		if (!imageFile || !imageTitle.trim()) {
			return { error: "Please select an image and enter a title." };
		}

		try {
			const response = await fetch("/api/images", {
				method: "POST",
				body: formData,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});
			if (!response.ok) {
				if (response.status === 400) {
					throw new Error(
						"Invalid upload. Please check your file and try again."
					);
				} else if (response.status === 401) {
					throw new Error(
						"Unauthorized. Please log in and try again."
					);
				} else {
					throw new Error(
						"Failed to upload image. Please try again later."
					);
				}
			}
		} catch (error) {
			// Network error
			console.error(error);
			return {
				error: error.message || "An unexpected network error occurred.",
			};
		}
	}

	const [state, formAction] = useActionState(uploadImage, null);

	return (
		<form action={formAction}>
			<div>
				<label htmlFor={fileInputId}>Choose image to upload: </label>
				<input
					id={fileInputId}
					name="image"
					type="file"
					accept=".png,.jpg,.jpeg"
					onChange={handleFileChange}
				/>
			</div>
			<div>
				<label>
					<span>Image title: </span>
					<input name="name" />
				</label>
			</div>

			<div>
				{" "}
				{previewSrc ? (
					<img
						style={{ maxWidth: "20em" }}
						src={previewSrc}
						alt="Image preview"
					/>
				) : (
					<p>No image selected.</p>
				)}
			</div>

			<button>Confirm upload</button>
			{state?.error && <p style={{ color: "red" }}>{state.error}</p>}
			{state?.success && (
				<p style={{ color: "green" }}>{state.success}</p>
			)}
		</form>
	);
}
