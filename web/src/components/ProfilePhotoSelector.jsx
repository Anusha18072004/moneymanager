import { Trash, Upload, User } from "lucide-react";
import { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = (e) => {
        e.preventDefault();
        inputRef.current.click();
    }
    return (
        <div className="flex justify-center mb-6">
            <input type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputRef}
                className="hidden"
            />

            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-indigo-100 rounded-full relative">
                    <User className="text-indigo-500" size={35} />
                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 absolute -bottom-1 -right-1"
                        onClick={onChooseFile}>
                        <Upload size={15} />
                    </button>

                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl} alt="profile photo" className="w-20 h-20 rounded-full object-cover" />
                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-800 absolute -bottom-1 -right-1"
                        onClick={handleRemoveImage}>
                        <Trash size={15} />
                    </button>
                </div>
            )}
        </div>
    )
}
export default ProfilePhotoSelector;