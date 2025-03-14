import { Link } from "react-router";
import { ImageUploadForm } from "./ImageUploadForm";
import "./ImageGallery.css";

export function ImageGallery({ isLoading, fetchedImages }) {
	const imageElements = fetchedImages.map((image) => (
		<div key={image._id} className="ImageGallery-photo-container">
			<Link to={"/images/" + image._id}>
				<img src={image.src} alt={image.name} />
			</Link>
		</div>
	));
	return (
		<div>
			<h2>Image Gallery</h2>

			<h3>Upload a new image</h3>
			<ImageUploadForm />

			{isLoading && "Loading..."}
			<div className="ImageGallery">{imageElements}</div>
		</div>
	);
}
