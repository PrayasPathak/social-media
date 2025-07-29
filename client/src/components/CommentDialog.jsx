import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommentForPost,
  fetchCommentsForPost,
} from "@/redux/commentSlice";
import moment from "moment";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CommentDialog({ open, setOpen, selectedPost }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const comments = useSelector(
    (state) => state.comment.commentsByPost[selectedPost?.id] || []
  );
  const loading = useSelector((state) => state.comment.loading);

  // Fetch comments when dialog opens
  useEffect(() => {
    if (open && selectedPost?.id) {
      fetchCommentsForPost(dispatch, selectedPost?.id);
    }
  }, [dispatch, open, selectedPost]);

  // Submit comment
  const sendMessageHandler = async () => {
    if (!text.trim()) return;
    if (!selectedPost?.id) {
      console.error("Post ID is undefined");
      return;
    }
    await createCommentForPost(dispatch, selectedPost?.id, text.trim());
    setText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        {/* Post preview */}
        <div className="mb-4">
          <img
            src={`${BASE_URL}${selectedPost?.mediaUrl}`}
            alt="post"
            className="w-full h-[300px] object-cover rounded-md"
          />
          <p className="text-sm text-gray-600 mt-2">{selectedPost?.caption}</p>
        </div>

        {/* Comment list */}
        <div className="max-h-[300px] overflow-y-auto space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground">No comments yet</p>
          ) : (
            comments.map((comment) => {
              const user = comment?.user;
              const profileUrl = user?.profilePicture
                ? `${BASE_URL}${user.profilePicture}`
                : "";
              console.log(comment);
              return (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileUrl} />
                    <AvatarFallback>
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {user?.fullName || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {comment.content || "No content"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {moment(comment?.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Input
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={sendMessageHandler}
            disabled={loading || !text.trim()}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
