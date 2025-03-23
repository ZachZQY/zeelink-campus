import * as $OpenApi from "@alicloud/openapi-client";
import * as $Dysmsapi from "@alicloud/dysmsapi20170525";

const config = {
  accessKeyId: "LTAI5t9mottuz2BGYE4NneBq",
  accessKeySecret: "b8Nwd5RKiEk8ywOYvrg6NLDSDBJFvg",
};
export type SendSmsInputs = {
  signName: string;
  templateCode: string;
  templateParam: Record<string, string>;
  phoneNumber: string;
};

export async function sendSms({
  signName = "快送校园",
  templateCode = "SMS_223565140",
  templateParam = { code: "123456" },
  phoneNumber = "17781373872",
}: SendSmsInputs): Promise<$Dysmsapi.SendSmsResponse> {
  try {
    const openApiConfig = new $OpenApi.Config({
      accessKeyId: config?.accessKeyId,
      accessKeySecret: config?.accessKeySecret,
    });
    openApiConfig.endpoint = "dysmsapi.aliyuncs.com";
    const client = new $Dysmsapi.default(openApiConfig);

    const sendSmsRequest = new $Dysmsapi.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName,
      templateCode,
      templateParam: JSON.stringify(templateParam),
    });

    const result = await client.sendSms(sendSmsRequest);
    console.log("短信发送成功:", result);
    return result; // 或者根据实际情况返回其他标识
  } catch (error) {
    console.error("短信发送失败:", error);
    throw error;
  }
}
