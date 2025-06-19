import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ThumbsUp,
  Clock,
  EyeIcon,
  ThumbsDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  User,
} from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);

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
  const getOrdinalYear = (year) => {
    const yearNum = parseInt(year);
    if (yearNum === 1) return "1st";
    if (yearNum === 2) return "2nd";
    if (yearNum === 3) return "3rd";
    if (yearNum === 4) return "4th";
    return `${yearNum}th`;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          label: "Rejected",
        };
      case "pending":
      default:
        return {
          icon: AlertCircle,
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          label: "Pending",
        };
    }
  };

  return (
    <>
      <motion.div
        className="h-full w-full"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <AnimatedGradientBorder
          gradientColors="from-primary via-accent to-primary"
          animationDuration={isHovered ? 4 : 8}
          containerClassName="h-full w-full"
          borderWidth="2px"
          borderRadius="rounded-xl"
        >
          <Card
            className={`h-full flex flex-col bg-black/30 backdrop-blur-lg ${className} overflow-hidden`}
          >
            {entry.featured && (
              <div className="absolute -right-12 -top-12 w-24 h-24 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg z-10">
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center text-xs text-white font-bold">
                  Featured
                </div>
              </div>
            )}
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-foreground text-2xl md:text-3xl font-bold text-left">
                {entry.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {isAdmin && (
                  <>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/20 text-primary border-primary/30"
                    >
                      {getOrdinalYear(entry.year)} Year
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-accent/20 text-accent border-accent/30"
                    >
                      {entry.branch}
                    </Badge>
                  </>
                )}
                {isAdmin && showAllDetails && entry.status && (
                  <Badge
                    variant="secondary"
                    className={`text-xs flex items-center gap-1 ${
                      getStatusInfo(entry.status).color
                    }`}
                  >
                    {React.createElement(getStatusInfo(entry.status).icon, {
                      className: "h-3 w-3",
                    })}
                    {getStatusInfo(entry.status).label}
                  </Badge>
                )}
              </div>
              {isAdmin && showAllDetails && entry.authorName && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>By: {entry.authorName}</span>
                  {entry.userId && (
                    <span className="text-xs opacity-70">
                      ({entry.userId.substring(0, 8)}...)
                    </span>
                  )}
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-primary/50 to-purple-500/30"></div>
            </CardHeader>
            <CardContent className="flex-grow px-5 py-4">
              <div className="flex flex-row justify-between items-center mb-4">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 border-primary/30"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isHovered
                        ? "text-red-500 fill-red-500"
                        : "text-accent fill-accent"
                    } transition-colors duration-300`}
                  />
                  <span className="font-semibold text-sm">
                    {entry.votes} votes
                  </span>
                </Badge>

                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
              </div>

              {isAdmin && showAllDetails && (
                <div className="mb-4 space-y-2">
                  {entry.voters && entry.voters.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {entry.voters.length} voter
                        {entry.voters.length !== 1 ? "s" : ""}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {entry.voters.length} votes
                      </Badge>
                    </div>
                  )}
                  {entry.voters && entry.voters.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <details className="cursor-pointer">
                        <summary className="hover:text-foreground transition-colors">
                          View voter IDs
                        </summary>
                        <div className="mt-1 ml-4 space-y-1">
                          {entry.voters.map((voterId, index) => (
                            <div key={voterId} className="font-mono text-xs">
                              {index + 1}. {voterId}
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                  {entry.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Updated:
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {entry.reviewedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Reviewed:
                        {new Date(
                          entry.reviewedAt.seconds
                            ? entry.reviewedAt.seconds * 1000
                            : entry.reviewedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {entry.reviewedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Reviewed by: {entry.reviewedBy.substring(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-white/80 line-clamp-2 text-left text-base">
                {truncateContent(entry.content, 60)}
              </p>
            </CardContent>
            <CardFooter className="flex flex-row justify-between items-center pt-3 pb-4 border-t border-border/20">
              <div className="flex items-center justify-start">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <IconButton
                    icon={EyeIcon}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(true)}
                    className="hover:bg-primary/10 transition-colors duration-300"
                  >
                    View
                  </IconButton>
                </motion.div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {user && !isAdmin && user.votedFor === entry.id && (
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <IconButton
                      icon={ThumbsDown}
                      variant="secondary"
                      size="sm"
                      disabled={votingFor === entry.id}
                      onClick={() => handleVote(entry.id)}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-500/30 shadow-lg shadow-red-500/10"
                    >
                      {votingFor === entry.id ? "Processing..." : "Unvote"}
                    </IconButton>
                  </motion.div>
                )}
                {user && !isAdmin && !user.votedFor && !hasVoted() && (
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <IconButton
                      icon={ThumbsUp}
                      variant="outline"
                      size="sm"
                      disabled={votingFor === entry.id}
                      onClick={() => handleVote(entry.id)}
                      className="border-primary/50 hover:bg-primary/20 transition-colors duration-300 shadow-lg shadow-primary/10"
                    >
                      {votingFor === entry.id ? "Voting..." : "Vote"}
                    </IconButton>
                  </motion.div>
                )}
                {isAdmin && (
                  <Link href={`/admin/entry/${entry.id}`}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <IconButton
                        icon={EyeIcon}
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary/20 transition-colors duration-300"
                      >
                        Manage
                      </IconButton>
                    </motion.div>
                  </Link>
                )}
              </div>
            </CardFooter>
          </Card>
        </AnimatedGradientBorder>
      </motion.div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-black/90 border-primary/40 backdrop-blur-md text-foreground shadow-xl shadow-primary/20">
          <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-900/20 via-black/0 to-purple-900/20 rounded-lg overflow-hidden"></div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
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
            <div className="flex items-center gap-2 mt-2">
              {isAdmin && (
                <>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/20 text-primary border-primary/30"
                  >
                    {getOrdinalYear(entry.year)} Year
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-accent/20 text-accent border-accent/30"
                  >
                    {entry.branch}
                  </Badge>
                </>
              )}
              {isAdmin && entry.status && (
                <Badge
                  variant="secondary"
                  className={`text-xs flex items-center gap-1 ${
                    getStatusInfo(entry.status).color
                  }`}
                >
                  {React.createElement(getStatusInfo(entry.status).icon, {
                    className: "h-3 w-3",
                  })}
                  {getStatusInfo(entry.status).label}
                </Badge>
              )}
            </div>
            <div className="space-y-2 mt-3">
              <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Submitted on {new Date(entry.createdAt).toLocaleDateString()}
              </DialogDescription>
              {isAdmin && entry.authorName && (
                <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Author: {entry.authorName}
                  {entry.userId && `(${entry.userId.substring(0, 12)}...)`}
                </DialogDescription>
              )}
              {isAdmin && entry.updatedAt && (
                <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated: {new Date(entry.updatedAt).toLocaleDateString()}
                </DialogDescription>
              )}
              {isAdmin && entry.reviewedAt && (
                <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Reviewed:
                  {new Date(
                    entry.reviewedAt.seconds
                      ? entry.reviewedAt.seconds * 1000
                      : entry.reviewedAt
                  ).toLocaleDateString()}
                </DialogDescription>
              )}
              {isAdmin && entry.reviewedBy && (
                <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Reviewed by: {entry.reviewedBy}
                </DialogDescription>
              )}
              {isAdmin && entry.voters && entry.voters.length > 0 && (
                <div className="space-y-1">
                  <DialogDescription className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    Voters: {entry.voters.length} user
                    {entry.voters.length !== 1 ? "s" : ""}
                  </DialogDescription>
                  <details className="cursor-pointer ml-5">
                    <summary className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      View voter details
                    </summary>
                    <div className="mt-2 ml-2 space-y-1 max-h-32 overflow-y-auto">
                      {entry.voters.map((voterId, index) => (
                        <div
                          key={voterId}
                          className="font-mono text-xs text-muted-foreground"
                        >
                          {index + 1}. {voterId}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="my-4 prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          </div>
          <div className="mt-6 flex justify-between items-center border-t border-primary/20 pt-4">
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-primary/30"
              >
                <Heart className="h-5 w-5 text-red-400 fill-red-400" />
                <span className="text-base font-medium">
                  {entry.votes} votes
                </span>
              </Badge>

              {isAdmin && entry.voters && entry.voters.length > 0 && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border-secondary/30"
                >
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-base font-medium">
                    {entry.voters.length} voter
                    {entry.voters.length !== 1 ? "s" : ""}
                  </span>
                </Badge>
              )}
            </div>

            {user && !hasVoted() && !isAdmin && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <IconButton
                  icon={ThumbsUp}
                  variant="outline"
                  size="md"
                  disabled={votingFor === entry.id}
                  onClick={() => {
                    handleVote(entry.id);
                    setShowModal(false);
                  }}
                  className="border-primary/50 bg-primary/10 hover:bg-primary/20"
                >
                  {votingFor === entry.id ? "Voting..." : "Vote for this entry"}
                </IconButton>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EntryCard;
