import { useEffect, useState } from "react";

const IMAGES = [
	{
		id: "0",
		src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blue_merle_koolie_short_coat_heading_sheep.jpg",
		name: "Blue merle herding sheep",
	},
	{
		id: "1",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg",
		name: "Huskies",
	},
	{
		id: "2",
		src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg",
		name: "Shiba",
	},
	{
		id: "3",
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/2560px-Felis_catus-cat_on_snow.jpg",
		name: "Tabby cat",
	},
	{
		id: "4",
		src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg",
		name: "Chickens",
	},
];

/**
 * Fetches images on component mount.  Returns an object with two properties: isLoading and fetchedImages, which will be
 * an array of ImageData
 *
 * @param imageId {string} the image ID to fetch, or all of them if empty string
 * @param delay {number} the number of milliseconds fetching will take
 * @returns {{isLoading: boolean, fetchedImages: ImageData[]}} fetch state and data
 */
export function useImageFetching(imageId, authToken, delay = 1000) {
	const [isLoading, setIsLoading] = useState(true);
	const [fetchedImages, setFetchedImages] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
        if (!authToken) {
            setFetchedImages([]);
            setIsLoading(false);
            setError("No auth token provided.");
            return;
        }

		let isStale = false;

		async function fetchData() {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/images", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

				if (!response.ok) {
					throw new Error("Failed to fetch images");
				}

				const data = await response.json();

				if (!isStale) {
                    // const imagesWithCorrectId = data.map(image => ({
					// 	...image,
					// 	id: image._id, // Map `_id` to `id`
					// }));
					setFetchedImages(data);
				}
			} catch (err) {
				if (!isStale) {
					setError(err.message);
				}
			} finally {
				if (!isStale) {
					setIsLoading(false);
				}
			}
		}

		fetchData();

		return () => {
			isStale = true;
		};
	}, [authToken, imageId]);

	return { isLoading, fetchedImages, error };
}
