declare type UserMode = "organizer" | "attendee" | "";

declare interface UserPublicProfile {
  userId: string;
  displayName: string;
  email: string;
  photoUrl: string;
}

declare interface UserProfile extends UserPublicProfile {}

declare type UserProfileUpdateObject = {
  displayName?: string;
  email?: string;
  photoUrl?: string;
};
