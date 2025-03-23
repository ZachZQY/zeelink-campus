import { ezClient } from "@/lib/zion/db";
import { checkVerificationCode } from "@/lib/api/verication_codes";
async function autoUser(mobile: string) {
  // 查询用户
  const user = await ezClient.queryGetFirstOne({
    name: "users",
    args: {
      where: {
        mobile: {
          _eq: mobile,
        },
      },
    },
    fields: ["id", "mobile", "password"],
  });
  if (user) {
    return user;
  }
  // 注册用户
  const newUser = await ezClient.mutationGetFirstOne({
    name: "insert_users",
    args: {
      objects: [
        {
          mobile: mobile,
        },
      ],
    },
    returning_fields: ["id", "mobile", "password"],
  });
  return newUser;
}

export async function authWithMoblieCode({
  mobile,
  code,
}: {
  mobile: string;
  code: string;
}): Promise<{ id: string; mobile: string | null }> {
  const isValid = await checkVerificationCode(mobile, code);
  if (!isValid) {
    throw new Error("Invalid code");
  }
  const user = await autoUser(mobile);
  // 去掉密码
  delete user.password;
  return user;
}

export async function authWithPassword({
  mobile,
  password,
}: {
  mobile: string;
  password: string;
}): Promise<{ id: string; mobile: string | null }> {
  const user = await autoUser(mobile);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.password !== password) {
    throw new Error("Invalid password");
  }
  // 去掉密码
  delete user.password;
  return user;
}
