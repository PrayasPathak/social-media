import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

import { readFileAsDataURL } from "@/lib/utils";
import { updatePost as updatePostService } from "@/api/postService";
import {
  updatePost as updatePostInStore,
  setPostLoading,
} from "@/redux/postSlice";

const EditPost = ({ open, setOpen, post }) => {
  const dispatch = useDispatch();
  const imageRef = useRef();

  const [caption, setCaption] = useState(post.caption || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const fileChangeHandler = async (e) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
      const dataUrl = await readFileAsDataURL(newFile);
      setPreview(dataUrl);
    }
  };

  const handleUpdatePost = async () => {
    if (!caption.trim() && !file) {
      toast.error("Caption or media required");
      return;
    }

    try {
      setLoading(true);
      dispatch(setPostLoading(true));

      const { data, error } = await updatePostService(post.id, {
        caption,
        mediaFile: file,
      });

      if (error || !data) {
        toast.error(error || "Failed to update post");
      } else {
        dispatch(updatePostInStore(data));
        toast.success("Post updated");
        setOpen(false);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      dispatch(setPostLoading(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-center font-semibold">
          Edit Post
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Update your caption..."
        />

        {(preview || post.mediaUrl) && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={
                preview ||
                `${import.meta.env.VITE_API_BASE_URL}${post.mediaUrl}`
              }
              alt="preview"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        <input
          type="file"
          ref={imageRef}
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select New Image
        </Button>

        {loading ? (
          <Button disabled className="w-full mt-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button onClick={handleUpdatePost} className="w-full mt-2">
            Update Post
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPost;
