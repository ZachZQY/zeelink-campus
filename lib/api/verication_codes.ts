import { ezClient } from "@/lib/zion/db";
import {sendSms,SendSmsInputs} from "@/lib//ali/aliSms";

export async function sendVerificationCode(mobile: string): Promise<{
  mobile: string;
  code: string;
}> {
  // 生成验证码
  const code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  const expires_at = new Date(Date.now() + 1000 * 60 * 5).getTime();
  // 验证码和手机号入库
  const data = await ezClient.mutationGetFirstOne({
    name: "insert_verification_codes",
    args: {
      objects: [
        {
          code: code,
          mobile: mobile,
          expires_at,
          type: "common"
        }
      ]
    },
    returning_fields: ["mobile", "code"]
  })
  // 发送验证码
  const smsInputs:SendSmsInputs = {
    phoneNumber: mobile,
    signName: "快送校园",
    templateCode: "SMS_223565140",
    templateParam: {
        code
    }
  }
  await sendSms(smsInputs);
  return data;
}

export async function checkVerificationCode(mobile: string, code: string): Promise<boolean> {
  const data = await ezClient.queryGetFirstOne({
    name: "verification_codes",
    args: {
      where: {
        mobile: {
          _eq: mobile
        },
        code: {
          _eq: code
        },
        expires_at: {
          _gt: Date.now()
        }
      }
    }
  })
  return !!data;
}