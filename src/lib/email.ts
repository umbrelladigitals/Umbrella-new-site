import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Self-signed sertifikalar için gerekebilir, production'da dikkatli olunmalı
  }
})

export async function sendProposalAcceptedEmail(proposal: any) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_TO_EMAIL || 'hello@umbrelladigitals.com'
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700&display=swap');
        body {
          background-color: #050505;
          color: #ffffff;
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #0a0a0a;
          border: 1px solid #333;
        }
        .header {
          background-color: #000;
          padding: 40px 20px;
          text-align: center;
          border-bottom: 1px solid #333;
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px;
        }
        .title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #ffffff;
          text-align: center;
        }
        .subtitle {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #888;
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .card {
          background-color: #111;
          border: 1px solid #222;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .label {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .value {
          font-size: 18px;
          color: #fff;
          font-weight: bold;
        }
        .highlight {
          color: #3b82f6; /* Umbrella Main Blue-ish */
        }
        .footer {
          background-color: #000;
          padding: 20px;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #444;
          border-top: 1px solid #333;
        }
        .btn {
          display: inline-block;
          background-color: #fff;
          color: #000;
          padding: 15px 30px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 50px;
          margin-top: 20px;
          text-transform: uppercase;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Umbrella Digital</div>
        </div>
        <div class="content">
          <div class="title">Protocol Initiated</div>
          <div class="subtitle">New Proposal Accepted</div>
          
          <div class="card">
            <div class="label">Client</div>
            <div class="value">${proposal.clientName}</div>
          </div>

          <div class="card">
            <div class="label">Project</div>
            <div class="value">${proposal.projectTitle}</div>
          </div>

          <div class="card">
            <div class="label">Value</div>
            <div class="value highlight">${JSON.parse(proposal.content).totalPrice.toLocaleString()} ${JSON.parse(proposal.content).currency}</div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/tracker" class="btn">Initialize Project</a>
          </div>
        </div>
        <div class="footer">
          DIGITAL ALCHEMY & CREATIVE ENGINEERING<br>
          SYSTEM NOTIFICATION // DO NOT REPLY
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: adminEmail,
      subject: `[PROTOCOL INITIATED] ${proposal.clientName} - ${proposal.projectTitle}`,
      html: htmlContent,
    })
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

export async function sendClientTrackerEmail(proposal: any, trackerSlug: string) {
  if (!proposal.clientEmail) return

  const trackerUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tracker/${trackerSlug}`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700&display=swap');
        body {
          background-color: #050505;
          color: #ffffff;
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #0a0a0a;
          border: 1px solid #333;
        }
        .header {
          background-color: #000;
          padding: 40px 20px;
          text-align: center;
          border-bottom: 1px solid #333;
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px;
        }
        .title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #ffffff;
          text-align: center;
        }
        .subtitle {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #888;
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .footer {
          background-color: #000;
          padding: 20px;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #444;
          border-top: 1px solid #333;
        }
        .btn {
          display: inline-block;
          background-color: #fff;
          color: #000;
          padding: 15px 30px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 50px;
          margin-top: 20px;
          text-transform: uppercase;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Umbrella Digital</div>
        </div>
        <div class="content">
          <div class="title">Project Initiated</div>
          <div class="subtitle">Welcome to the Nexus</div>
          
          <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">
            Dear ${proposal.clientName},
          </p>
          <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">
            We are thrilled to begin this journey with you. Your project protocol has been successfully initiated.
            You can track the progress, view updates, and access deliverables through your dedicated project vault below.
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${trackerUrl}" class="btn">Access Project Vault</a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Please keep this link secure. It is your direct line to the project's pulse.
          </p>
        </div>
        <div class="footer">
          DIGITAL ALCHEMY & CREATIVE ENGINEERING<br>
          SYSTEM NOTIFICATION // DO NOT REPLY
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: proposal.clientEmail,
      subject: `[PROJECT INITIATED] Welcome to Umbrella Digital - ${proposal.projectTitle}`,
      html: htmlContent,
    })
    console.log('Client email sent successfully')
  } catch (error) {
    console.error('Error sending client email:', error)
  }
}
