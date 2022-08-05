# SocialMediaApp
Minimal Social App using MERN Stack

This is a forked version of Social Media App by JSMastery.

Last month I found a great MERN Tutorial on YouTube. [this video](https://youtu.be/VsUzmlZfYNg). I tried to code by watching tutorial but while I was learning from the video I found most of the codes are old and obsolete. I don't like reading old api docs, so I tried to code with latest apis.

In the tutorial, JSMastery mostly used javascript but I decided to use typescript for type safety. 

# Frontend
For the frontend I used React + ViteJS for faster dev experience. I was using react-scripts at first and it becomes slower as the project grows. So, I decided to swtich to ViteJS and it was super fast. Of course, typescript for type checking and it saved me a lot of error solving time.

* For fetching Api, axios + createAsynThunk from Redux.
* For injecting Head Tag, react-helmet-async
* For notification, react-toastify
* For State Management, Redux Toolkit
* and many more...

# Backend
For the backend I used Express along

* JWT for authenication
* bcryptjs for encryption
* aws s3 + multer middleware for file uploading
* mongoose for database
* mvc design pattern without views ( i don't need views bcuz i used react XD )

# Thanks for reading

Let me know if you want to create a project together, I'm also looking for people to code any projects.


