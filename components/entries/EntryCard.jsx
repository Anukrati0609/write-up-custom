import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ThumbsUp, Clock, EyeIcon, ThumbsDown } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const EntryCard = ({
  entry,
  user,
  hasVoted,
  votingFor,
  handleVote,
  isAdmin = false,
  showAllDetails = false,
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (content, maxWords = 50) => {
    const words = stripHtml(content).split(" ");
    if (words.length <= maxWords) return stripHtml(content);
    return words.slice(0, maxWords).join(" ") + "...";
  };

  return (
    <>
      <AnimatedGradientBorder
        gradientColors="from-primary via-accent to-primary"
        animationDuration={8}
        containerClassName="h-full"
      >
        <Card
          className={`h-full flex flex-col bg-black/10 backdrop-blur-sm ${className}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground line-clamp-1 flex justify-between items-center">
              <span>{entry.title}</span>
              {entry.featured && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-amber-500/20 text-amber-400 border-amber-500/30"
                >
                  Featured
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-grow pb-4">
            <p className="text-muted-foreground line-clamp-4">
              {truncateContent(entry.content, 40)}
            </p>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-4 border-t border-border/40">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs">
                {entry.createdAt
                  ? new Date(entry.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-2 py-1"
              >
                <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
                <span>{entry.votes}</span>
              </Badge>

              {!isAdmin && (
                <IconButton
                  icon={EyeIcon}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(true)}
                  className="hover:bg-primary/10"
                >
                  View
                </IconButton>
              )}

              {user &&
                !isAdmin &&
                (user.votedFor === entry.id ? (
                  <IconButton
                    icon={ThumbsDown}
                    variant="secondary"
                    size="sm"
                    disabled={votingFor === entry.id}
                    onClick={() => handleVote(entry.id)}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-500"
                  >
                    {votingFor === entry.id ? "Processing..." : "Unvote"}
                  </IconButton>
                ) : !hasVoted() ? (
                  <IconButton
                    icon={ThumbsUp}
                    variant="outline"
                    size="sm"
                    disabled={votingFor === entry.id}
                    onClick={() => handleVote(entry.id)}
                  >
                    {votingFor === entry.id ? "Voting..." : "Vote"}
                  </IconButton>
                ) : null)}

              {isAdmin && (
                <Link href={`/admin/entry/${entry.id}`}>
                  <IconButton
                    icon={EyeIcon}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/20"
                  >
                    Manage
                  </IconButton>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </AnimatedGradientBorder>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-black/80 border-primary/20 backdrop-blur-md text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {entry.title}
              {entry.featured && (
                <Badge
                  variant="secondary"
                  className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                >
                  Featured
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Submitted on {new Date(entry.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1.5"
            >
              <Heart className="h-4 w-4 text-accent fill-accent" />
              <span>{entry.votes} votes</span>
            </Badge>

            {user && !hasVoted() && (
              <IconButton
                icon={ThumbsUp}
                variant="outline"
                size="sm"
                disabled={votingFor === entry.id}
                onClick={() => {
                  handleVote(entry.id);
                  setShowModal(false);
                }}
              >
                {votingFor === entry.id ? "Voting..." : "Vote for this entry"}
              </IconButton>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EntryCard;
