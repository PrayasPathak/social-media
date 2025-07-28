import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { setAuthUser } from "@/redux/authSlice";
import {
  updateProfileData,
  setProfileError,
  setProfileLoading,
} from "@/redux/profileSlice";
import { updateProfile } from "@/api/profileService";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture || null,
    bio: user?.bio || "",
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
    }
  };

  const editProfileHandler = async () => {
    dispatch(setProfileLoading(true));

    const { bio, profilePhoto } = input;

    const { data, error } = await updateProfile({
      bio,
      imageFile: profilePhoto instanceof File ? profilePhoto : null,
    });

    if (data) {
      dispatch(updateProfileData(data));
      dispatch(
        setAuthUser({
          ...user,
          bio: data.bio,
          profilePicture: data.profilePicture,
        })
      );
      toast.success("Profile updated successfully");
      navigate(`/profile/${user.userId}`);
    } else {
      dispatch(setProfileError(error));
      toast.error(error);
    }

    dispatch(setProfileLoading(false));
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={
                  input.profilePhoto instanceof File
                    ? URL.createObjectURL(input.profilePhoto)
                    : input.profilePhoto
                }
                alt="profile"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {input.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef.current?.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Change photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={editProfileHandler}
            className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            disabled={useSelector((state) => state.profile.loading)}
          >
            {useSelector((state) => state.profile.loading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
