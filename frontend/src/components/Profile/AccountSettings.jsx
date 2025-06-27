import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Settings,
  LogOut,
  Trash2,
  Shield,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  MapPin,
  User,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChangePasswordDialog from "./ChangePasswordDialog";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function AccountSettings({
  user,
  onLogout,
  onChangePassword,
  isUpdating,
}) {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  const [sessionLogoutLoading, setSessionLogoutLoading] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosPrivate.get("/auth/sessions");
        setSessions(res.data.sessions);
        toast.success("Sessions loaded", {
          description: `Found ${res.data.sessions.length} active session(s)`,
        });
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        toast.error("Failed to load sessions", {
          description:
            "Unable to retrieve your active sessions. Please try again.",
        });
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);

  const handleLogoutSession = async (sessionId) => {
    setSessionLogoutLoading(sessionId);
    try {
      await axiosPrivate.delete(`/auth/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Session terminated", {
        description: "Successfully logged out from the selected device",
      });
    } catch (err) {
      console.error("Failed to logout session", err);
      toast.error("Logout failed", {
        description: "Unable to terminate the session. Please try again.",
      });
    } finally {
      setSessionLogoutLoading(null);
    }
  };

  const handleLogoutAll = async () => {
    setLogoutAllLoading(true);
    try {
      await axiosPrivate.delete("/auth/sessions");
      const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      toast.success("All sessions terminated", {
        description: `Successfully logged out from ${otherSessionsCount} other device(s)`,
      });
    } catch (err) {
      console.error("Failed to logout all", err);
      toast.error("Logout failed", {
        description:
          err.message || "Unable to terminate all sessions. Please try again.",
      });
    } finally {
      setLogoutAllLoading(false);
    }
  };

  const getDeviceIcon = (deviceInfo) => {
    const info = deviceInfo?.toLowerCase() || "";
    if (
      info.includes("mobile") ||
      info.includes("android") ||
      info.includes("iphone")
    ) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      {/* User Profile Card */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">Profile Information</div>
              <div className="text-sm text-muted-foreground font-normal">
                Manage your account details
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Provider</div>
                <Badge variant="outline" className="text-xs">
                  {user?.provider === "local"
                    ? "Email & Password"
                    : user?.provider}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings Card */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-xl font-bold">Security Settings</div>
              <div className="text-sm text-muted-foreground font-normal">
                Manage your password and security preferences
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.provider === "local" && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <ChangePasswordDialog
                onChangePassword={onChangePassword}
                isUpdating={isUpdating}
              />
            </div>
          )}

          <Separator />

          {/* Logout Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout Options
            </h4>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={isUpdating}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout from this device
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-red-500" />
                    Confirm Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your account session from this device.
                    You'll need to log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onLogout}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging Out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-xl font-bold">Active Sessions</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {loadingSessions
                    ? "Loading..."
                    : `${sessions.length} active session(s)`}
                </div>
              </div>
            </div>
            {sessions.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {sessions.filter((s) => s.isCurrent).length} current
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading active sessions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active sessions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      session.isCurrent
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                        : "bg-muted/30 hover:bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-background rounded-md">
                          {getDeviceIcon(session.deviceInfo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {session.deviceInfo || "Unknown Device"}
                            </h4>
                            {session.isCurrent && (
                              <Badge
                                variant="default"
                                className="text-xs px-2 py-0"
                              >
                                This Device
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {session.ipAddress}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(session.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created:{" "}
                              {new Date(session.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleLogoutSession(session.id)}
                          disabled={sessionLogoutLoading === session.id}
                          className="shrink-0"
                        >
                          {sessionLogoutLoading === session.id ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Ending...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 mr-1" />
                              End Session
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {sessions.length > 1 && sessions.some((s) => !s.isCurrent) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-2"
                >
                  <Separator className="mb-4" />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={logoutAllLoading}
                      >
                        {logoutAllLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Ending all sessions...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            End all other sessions (
                            {sessions.filter((s) => !s.isCurrent).length})
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <Trash2 className="w-5 h-5 text-red-500" />
                          End All Other Sessions?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log you out from all other devices except
                          this one. You'll need to log in again on those devices
                          to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLogoutAll}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={logoutAllLoading}
                        >
                          {logoutAllLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Ending sessions...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              End All Other Sessions
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
