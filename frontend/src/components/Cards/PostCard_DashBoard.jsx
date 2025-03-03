import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

function PostCard_DashBoard({ post }) {
  const { user, date, title, description, image, stats } = post;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div>
      <Card className="bg-gradient-to-br min-w-fit max-w-[200px] from-[#752345] to-[#352736] border-none cursor-pointer ">
        <CardHeader className="p-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-300">{date}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 px-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 mt-2 text-gray-300">
            <div className="flex items-center gap-1">
              <HeartIcon setLiked={setLiked} liked={liked} />
              <span>{stats.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookmarkIcon
                setBookmarked={setBookmarked}
                bookmarked={bookmarked}
              />
              <span>{stats.bookmarks}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="text-[#FC607F] h-5 w-5" />
              <span>{stats.comments}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PostCard_DashBoard;
