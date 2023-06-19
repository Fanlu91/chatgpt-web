import * as tencentcloud from 'tencentcloud-sdk-nodejs'
import * as dotenv from 'dotenv'
import type { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface'
dotenv.config()

const SmsClient = tencentcloud.sms.v20210111.Client

const clientParams: ClientConfig = {
  credential: {
    secretId: process.env.SECRET_ID || '',
    secretKey: process.env.SECRET_KEY || '',
  },
  region: 'ap-guangzhou',
  profile: {
    signMethod: 'HmacSHA256',
    httpProfile: {
      reqMethod: 'POST',
      reqTimeout: 30,
      endpoint: 'sms.tencentcloudapi.com',
    },
  },
}

const client = new SmsClient(clientParams)

interface SendSmsParams {
  SmsSdkAppId: string
  SignName: string
  ExtendCode?: string
  SenderId?: string
  SessionContext?: string
  PhoneNumberSet: string[]
  TemplateId: string
  TemplateParamSet: string[]
}

// const params: SendSmsParams = {
//   SmsSdkAppId: process.env.SDK_APP_ID || '',
//   SignName: process.env.SIGN_NAME || '',
//   ExtendCode: '',
//   SenderId: '',
//   SessionContext: '',
//   PhoneNumberSet: ['+8618810390037'],
//   TemplateId: process.env.TEMPLATE_ID || '',
//   TemplateParamSet: ['666666'],
// }

// 使用 Promise，以便在 async/await 中使用
// export async function sendSms(params: SendSmsParams) {
//   return new Promise((resolve, reject) => {
//     client.SendSms(params, (err: any, response: any) => {
//       if (err)
//         reject(err)

//       else
//         resolve(response)
//     })
//   })
// }

export async function sendSms(phoneNumber: string, code: string, templateId: string) {
  const params: SendSmsParams = {
    SmsSdkAppId: process.env.SDK_APP_ID || '',
    SignName: process.env.SIGN_NAME || '',
    ExtendCode: '',
    SenderId: '',
    SessionContext: '',
    PhoneNumberSet: [`+86${phoneNumber}`],
    TemplateId: templateId,
    TemplateParamSet: [`${code}`],
  }
  return new Promise((resolve, reject) => {
    client.SendSms(params, (err: any, response: any) => {
      // console.log('sendSms', err, response, code)
      if (err || response.SendStatusSet[0].Code !== 'Ok') {
        const errorMsg = err || response.SendStatusSet[0].Message
        console.error(`Failed to send SMS: ${errorMsg}`)
        reject(new Error(errorMsg))
      }
      else {
        resolve(response)
      }
    })
  })
}

export async function sendRegisterSms(phoneNumber: string, code: string): Promise<any> {
  try {
    return await sendSms(phoneNumber, code, process.env.REGISTER_TEMPLATE_ID || '')
  }
  catch (err) {
    console.error(`Failed to send register SMS: ${err}`)
    throw err
  }
}

export async function sendLoginSms(phoneNumber: string, code: string) {
  sendSms(phoneNumber, code, process.env.LOGIN_TEMPLATE_ID)
}

export async function sendResetPasswordSms(phoneNumber: string, code: string) {
  sendSms(phoneNumber, code, process.env.RESET_PASSWORD_TEMPLATE_ID)
}
// 使用
// (async () => {
//   try {
//     const response = await sendSms(params)
//     console.log(response)
//   }
//   catch (err) {
//     console.error(err)
//     // 抛出错误，或者报告错误
//     throw err
//   }
// })()
