import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendWelcomeEmail = async (name, email) => {
    await transporter.sendMail({
        from: `"TechMarket" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to TechMarket!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
                <div style="text-align: center; padding: 15px 0;">
                    <h1 style="color: #2563eb; margin: 0;">TechMarket</h1>
                    <p style="color: #6b7280; font-size: 13px;">Your World of Technology</p>
                </div>

                <div style="padding: 20px 0;">
                    <h2 style="color: #111827;">Welcome, ${name}!</h2>

                    <p style="color: #4b5563; line-height: 1.7;">
                        Thank you for joining TechMarket. We're excited to have you as part of our technology-loving community.
                    </p>

                    <p style="color: #4b5563; line-height: 1.7;">
                        Your account has been successfully created. Explore our latest smartphones, laptops, accessories, and other exciting electronics.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.CLIENT_URL}"
                           style="background: #2563eb; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Start Shopping
                        </a>
                    </div>

                    <p style="color: #4b5563; line-height: 1.7;">
                        We're here to make your shopping experience simple, convenient, and enjoyable.
                    </p>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                    <p style="color: #6b7280; margin-bottom: 5px;">Happy Shopping!</p>
                    <strong style="color: #111827;">The TechMarket Team</strong>

                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 25px;">
                        © ${new Date().getFullYear()} TechMarket. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    });
};