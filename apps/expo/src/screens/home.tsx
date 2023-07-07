import React from "react";

import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";

import { trpc } from "../utils/trpc";

// Sign out button component
const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="border-navy rounded-lg border-2 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

// Takes in Post object as a prop and returns a PostCard component
const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  return (
    <View className="border-navy rounded-lg border-2 p-4">
      <Text className="text-lilac text-xl font-semibold">
        {post.authorUsername}
      </Text>
      <Text className="text-offwhite">{post.content}</Text>
    </View>
  );
};

const CreatePost: React.FC = () => {
  const utils = trpc.useContext();
  const { user } = useUser();
  const { mutate } = trpc.post.create.useMutation({
    async onSuccess() {
      await utils.post.all.invalidate();
    },
  });

  const [content, onChangeContent] = React.useState("");

  return (
    <View className="border-navy flex flex-col border-t-2 p-4">
      {/* Small profile picture in top right */}
      <Image
        source={{ uri: user?.profileImageUrl }}
        className="h-24 w-24 rounded-full"
      />
      {/* Text input for your sound bite */}
      <TextInput
        className="border-navy text-offwhite mb-2 rounded border-2 p-2"
        onChangeText={onChangeContent}
        placeholder="Content"
      />
      {/* Button to publish your sound bite */}
      <TouchableOpacity
        className="bg-lilac rounded p-2"
        onPress={() => {
          mutate(content);
        }}
      >
        <Text className="text-offwhite font-semibold">Publish post</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);

  return (
    <SafeAreaView className="bg-midnight">
      <View className="h-full w-full p-4">
        <Text className="text-offwhite mx-auto pb-2 text-5xl font-bold">
          Create <Text className="text-lilac]">T3</Text> Turbo
        </Text>

        <View className="py-2">
          {showPost ? (
            <Text className="text-offwhite">
              <Text className="font-semibold">Selected post:</Text>
              {showPost}
            </Text>
          ) : (
            <Text className="text-offwhite font-semibold italic">
              Press on a post
            </Text>
          )}
        </View>

        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <TouchableOpacity onPress={() => setShowPost("" + p.item.id)}>
              <PostCard post={p.item} />
            </TouchableOpacity>
          )}
        />

        <CreatePost />
        <SignOut />
      </View>
    </SafeAreaView>
  );
};
