[Spark! Applicant Portal](https://buspark.app/) Official Project Documentation

## **<span style="text-decoration:underline;">Project Structure:</span>**

**GitHub Repository**: [https://github.com/BU-Spark/project-engage](https://github.com/BU-Spark/project-engage)

**GitHub repository main structure:** \
<span style="text-decoration:underline;">project-engage/</span>

- <span style="text-decoration:underline;">functions/</span>: folder that supports firebase functions deployment
  - <span style="text-decoration:underline;">adminData/</span>: folder that ???
    - ???
  - <span style="text-decoration:underline;">emailFunctions/</span>: folder that ???
    - ???
  - <span style="text-decoration:underline;">functionDeploy.js</span>
  - <span style="text-decoration:underline;">index.js</span>
  - <span style="text-decoration:underline;">package.json</span>
  - <span style="text-decoration:underline;">userSetUp/</span>: folder that ???
    - ???
- <span style="text-decoration:underline;">src/</span>: folder that includes all the vue files
  - <span style="text-decoration:underline;">assets/</span>: folder that includes all the images
  - <span style="text-decoration:underline;">components/</span>
    - <span style="text-decoration:underline;">Admin/</span>
      - <span style="text-decoration:underline;">AdminDashboard.vue</span>
        ![AdminDashboard.vue](./images/1.png)
      - <span style="text-decoration:underline;">AdminNavbar.vue</span>
        ![AdminNavbar.vue](./images/2.png)
      - <span style="text-decoration:underline;">ApplicationForm.vue</span>
        ![ApplicationForm.vue](./images/3.png)
      - <span style="text-decoration:underline;">ApplicationForms.vue</span>
        ![ApplicationForms.vue](./images/4.png)
      - <span style="text-decoration:underline;">EmailUI.vue</span>
        ![EmailUI.vue](./images/5.png)
      - <span style="text-decoration:underline;">InviteAdmin.vue</span>
        ![InviteAdmin.vue](./images/6.png)
      - <span style="text-decoration:underline;">StudentApplication.vue</span>
        ![StudentApplication.vue](./images/7.png)
      - <span style="text-decoration:underline;">StudentApplications.vue</span>
        ![StudentApplications.vue](./images/8.png)
      - <span style="text-decoration:underline;">ViewStudentProfile.vue</span>
        ![ViewStudentProfile.vue](./images/9.png)
    - <span style="text-decoration:underline;">General/</span>
      - <span style="text-decoration:underline;">Profile.vue</span>
        ![Profile.vue](./images/10.png)
    - <span style="text-decoration:underline;">Login/</span>
      - <span style="text-decoration:underline;">admin.vue</span>
        <div></div>
        ![admin.vue](./images/11.png)
      - <span style="text-decoration:underline;">AdminLoginForm.vue</span>
        ![AdminLoginForm.vue](./images/12.png)
      - <span style="text-decoration:underline;">GoogleLoginButton.vue</span>
        ![GoogleLoginButton.vue](./images/13.png)
      - <span style="text-decoration:underline;">LoginForm.vue</span>
        ![LoginForm.vue](./images/14.png)
      - <span style="text-decoration:underline;">student.vue</span>
        ![student.vue](./images/15.png)
    - <span style="text-decoration:underline;">Student/</span>
      - <span style="text-decoration:underline;">Application.vue</span>
        ![Application.vue](./images/16.png)
      - <span style="text-decoration:underline;">Applications.vue</span>
        ![Applications.vue](./images/17.png)
      - <span style="text-decoration:underline;">StudentDashboard.vue</span>
        ![StudentDashboard.vue](./images/17.png)
      - <span style="text-decoration:underline;">StudentNavbar.vue</span>
        ![StudentNavbar.vue](./images/19.png)


## **<span style="text-decoration:underline;">Project Database:</span>**

**Firebase**: [https://console.firebase.google.com/u/0/project/spark-project-engage/overview](https://console.firebase.google.com/u/0/project/spark-project-engage/overview)

- Users and permissions: manage user’s access to Firebase
![Users and permissions](./images/20.png)

- Authentication: account authentication for Sign in / Log out
![Authentication](./images/21.png)

- Firestore Database: stores data
![Firestore Database data](./images/22.png)

    Database structure:

    * <span style="text-decoration:underline;">applicationTemplate</span>: admin’s application templates
        * [application type]

            (such as Base, Civic Tech Co-Lab Interest Form, Employment Opportunities, etc.)
            
            * [map of semester as keys to map of fields]
                * Template (map)
                *	deadline (string)
                *	description (string)
                *	schema (array)

    * <span style="text-decoration:underline;">applications</span>: student’s application submissions
        * [semester]

            (such as Fall 2021, Fall 2022, Ongoing, Spring 2022, Summer 2022)

            * [application type]
                * [applicant ID]
                    * [application responses]
    * <span style="text-decoration:underline;">invites</span>: email addresses that are invited to be admins
        * [invitation ID]
            * inviteeEmail (string)
            * invitorEmail (string)
    * <span style="text-decoration:underline;">users</span>: all users’ basic information
        * [user ID]
            * applications (map)
                * [semester] (array of application submission status)
            * displayName (string)
            * email (string)
            * photoURL (string)
            * uid (string)

- Firestore Database: data access rules
![Firestore Database rules](./images/23.png)

- Storage: stores student resumes and other files
![Storage](./images/24.png)

## **<span style="text-decoration:underline;">Project Deployment:</span>**

- The project is hosted on Firebase, automated by GitHub Actions when pushed to branch “prod”
- Web address: [https://buspark.app/](https://buspark.app/)

## **<span style="text-decoration:underline;">Next Steps:</span>**

- Gmail api refresh token issue
- Open applications on new page or side-by-side
- Bugs reporting feature
- Downloadable feature
