import { ezClient } from "@/lib/zion/db";
// 获取cookie

export type image = {
  name: string;
  path: string;
  url: string;
};
export type publishPostInputs = {
  site_id?: string | number | null;
  user_id?: string | number | null;
  content: string;
  images: image[];
  topicNames: string[];
};
export type publishPostOutputs = {
  id: string | number;
};

type Topic = {
  id: string;
  name: string;
};
async function getTopicsByAutoComplete(topicNames: string[]): Promise<Topic[]> {
  const topics: Topic[] = await ezClient.query({
    name: "topics",
    args: {
      where: {
        name: {
          _in: topicNames.filter((name) => name != ""),
        },
      },
    },
    fields: ["id", "name"],
  });
  // 筛选出没有查到name的话题
  const notFoundNames = topicNames.filter(
    (name) => !topics.some((topic) => topic.name === name)
  );

  if (notFoundNames.length === 0) {
    return topics;
  }
  // 创建没有查到name的话题
  const { returning: createdTopics } = await ezClient.mutation({
    name: "insert_topics",
    args: {
      objects: notFoundNames.map((name) => ({ name })),
    },
    fields: {
      name: "returning",
      fields: ["id", "name"],
    },
  });
  // 合并创建的话题
  const allTopics: Topic[] = [...topics, ...createdTopics];
  return allTopics;
}

// 发布文章
export async function publishPost(
  publishPostInputs: publishPostInputs
): Promise<publishPostOutputs> {
  const { content, images, user_id, site_id } = publishPostInputs;
  const topics = await getTopicsByAutoComplete(publishPostInputs.topicNames);

  const res: publishPostOutputs = await ezClient.mutationGetFirstOne({
    name: "insert_posts",
    args: {
      objects: [
        {
          content: content,
          media_data: {
            images:
              images?.map((image) => ({
                name: image.name,
                path: image.path,
                url: image.url,
              })) || [],
          },
          author_users: user_id || null,
          site_sites: site_id || 1,
          post_topics: {
            data: topics.map((topic) => ({
              topic_topics: topic.id,
            })),
          },
        },
      ],
    },
    returning_fields: ["id"],
  });
  return res;
}
