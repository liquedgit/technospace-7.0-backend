import Imap from "imap-simple";
import { READ_MAIL_CONFIG, emailSender, emailSenderPassword } from "../util/constant";
import { Request, Response } from "express";
import { simpleParser } from "mailparser";
import { EmailResponseDto } from "../dto/email.respose.dto";
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { ReplyEmailRequestDto } from "../dto/reply.email.request.dto";
import { ResponseDto } from "../dto/response.dto";

export const GetEmail = async (req: Request, res: Response) => {
  try {

    const pageNumber = req.query.pageNumber?.toString() || 1
    const perPage = req.query.perPage?.toString() || 10
    const search = req.query.name?.toString() || ""
    let numberPage: number = 0
    let numberPerPage: number = 0
    if (typeof perPage == "string" && !isNaN(parseInt(perPage))) {
      numberPerPage = parseInt(perPage);
    } else if (typeof perPage == "number") {
      numberPerPage = perPage
    }
    if (typeof pageNumber == "string" && !isNaN(parseInt(pageNumber))) {
      numberPage = parseInt(pageNumber);
    } else if (typeof pageNumber == "number") {
      numberPage = pageNumber
    }

    await Imap.connect(READ_MAIL_CONFIG).then((async function (connection) {
      await connection.openBox('INBOX');
      var searchCriteria = [
        'UNSEEN',
      ];
      var fetchOptions = {
        bodies: ['HEADER', 'TEXT'],
        markSeen: false
      };
      const results = await connection.search(searchCriteria, fetchOptions);


      if (results.length >= numberPerPage * numberPage) {
        const newResults = results.slice((numberPerPage * numberPage) - numberPerPage, numberPerPage * numberPage)
        var emailResponseDtos: EmailResponseDto[] = [];
        for (let i = 0; i < newResults.length; i++) {
          const result = newResults[i];
          const uid = result.attributes.uid;
          const from = result.parts[1].body.from[0];
          const date = result.parts[1].body.date[0];
          const subject = result.parts[1].body.subject[0];
          const email = await simpleParser(result.parts[0].body);

          const emailResponseDto: EmailResponseDto = {
            emailId: uid,
            from: from,
            date: date,
            subject: subject,
            bodyText: email.text,
          };

          emailResponseDtos.push(emailResponseDto);
        }

        const responseDto: ResponseDto<EmailResponseDto[]> = {
          data: emailResponseDtos
        }

        return res.status(200).json(responseDto);
      }

      var emailResponseDtos: EmailResponseDto[] = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const uid = result.attributes.uid;
        const from = result.parts[1].body.from[0];
        const date = result.parts[1].body.date[0];
        const subject = result.parts[1].body.subject[0];
        const email = await simpleParser(result.parts[0].body);

        const emailResponseDto: EmailResponseDto = {
          emailId: uid,
          from: from,
          date: date,
          subject: subject,
          bodyText: email.text,
        };

        emailResponseDtos.push(emailResponseDto);
      }
      const responseDto: ResponseDto<EmailResponseDto[]> = {
        data: emailResponseDtos
      }

      return res.status(200).json(responseDto);
    }));
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: ["Internal Server Error"] })
  }
}

export const ReplyEmail = async (req: Request, res: Response) => {
  try {
    const reqBody: ReplyEmailRequestDto = req.body
    const boolean = await sendEmail(reqBody.emailId, reqBody.email, reqBody.message);

    if (boolean) {
      return res.status(200);
    }

    return res.status(400)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: ["Internal Server Error"] })
  }
}

export const sendEmail = async (
  emailId: number,
  email: string,
  message: string
): Promise<boolean> => {

  const emailAddress = extractEmailAddress(email)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailSender,
      pass: emailSenderPassword,
    },
  });

  const mailOptions: MailOptions = {
    from: emailSender,
    to: emailAddress,
    subject: 'MyHelpDesk - Customer Service Center',
    html: `<div id=":15g" class="a3s aiL msg-2564905172801731076">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tbody>
        <tr>
          <td
            bgcolor="#f3f4f6"
            align="center"
            style="padding: 30px 10px 10px 10px;"
          >
            <table border="0" cellpadding="0" cellspacing="0" width="500">
              <tbody>
                <tr>
                  <td bgcolor="#FAF9F7">
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      style="width: 100% !important;"
                    >
                      <tbody>
                        <tr>
                          <td align="center">
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style="width: 100% !important;"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="padding: 10px 10px 25px 10px;"
                                    align="center"
                                  ></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table
                              width="90%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    align="center"
                                    style="
                                      padding: 0px 10px 30px 10px;
                                      font-size: 15px;
                                      line-height: 22px;
                                      font-family: Open Sans, Lucida,
                                        Lucida Sans, Lucida Grande, Arial,
                                        sans-serif !important;
                                      color: #4b5563;
                                    "
                                  >
                                    <p>
                                      ${message}
                                    </p>
                                 
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
               
                        <tr>
                          <td align="center">
                            <div
                              class="a6S"
                              dir="ltr"
                              style="opacity: 0.01; left: 305px; top: 566px;"
                            ></div>
                          </td>
                        </tr>
                        
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tbody>
        <tr>
          <td
            bgcolor="#f3f4f6"
            align="center"
            style="padding: 10px 15px 20px 15px;"
          >
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody>
                <tr>
                  <td bgcolor="#f3f4f6" align="center">
                    <table
                      width="500"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      align="center"
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            style="
                              font-size: 14px;
                              line-height: 16px;
                              font-family: Open Sans, Lucida, Lucida Sans,
                                Lucida Grande, Arial, sans-serif !important;
                              color: #9ca3af;
                            "
                          >
                            <span
                              style="color: #d1d5db; font-size: 12px;"
                              class="m_-2564905172801731076appleFooter"
                            >
                              © 2024 MyHelpDesk, Anggrek Campus R 600
                            </span>
                            <br />
                            <br />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
      markEmailAsSeen(emailId)
      return true;
    }
  });
  return false;
};

async function markEmailAsSeen(emailId: number) {
  try {
    const connection = await Imap.connect(READ_MAIL_CONFIG);

    await connection.openBox('INBOX');

    const searchCriteria = ['UID', emailId];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: true
    };

    const results = await connection.search(searchCriteria, fetchOptions);

    if (results.length === 0) {
      console.log(`Email with UID ${emailId} not found.`);
    } else {
      await connection.addFlags(emailId, ['\\Seen']);
      console.log(`Marked email with UID ${emailId} as seen.`);
    }

    connection.end();
  } catch (err) {
    console.error('Error marking email as seen:', err);
  }
}

function extractEmailAddress(inputString: string) {
  const regex = /<([^>]+)>/;
  const match = regex.exec(inputString);
  if (match && match.length > 1) {
    return match[1];
  } else {
    return "";
  }
}