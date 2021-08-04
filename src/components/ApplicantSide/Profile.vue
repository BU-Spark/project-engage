// NOTE: if you want to create another interface

<template>
  <div id="main-container">
    <div v-if="pageStatus == 1">
      <div class="header-profile">
        <v-img
          src="@/assets/null-profile-img.svg"
          max-height="75"
          max-width="75"
          class="profile-img"
        >
        </v-img>
        <v-btn class="edit-profile-btn" @click="updatePageStatus(1)">
          Edit
        </v-btn>
      </div>
      <div class="body-profile">
        <h5>First Name</h5>
        <h5>Last Name</h5>
        <h5>Email</h5>
        <h5>BU ID</h5>
        <h5>Cell Phone</h5>
        <h5>Portfolio Link</h5>
        <h5>Major</h5>
        <h5>Minor</h5>
        <h5>School Year</h5>
        <h5>Expected Graduation</h5>
        <h5>Gender</h5>
        <h5>GenderStudent</h5>
      </div>
      <div class="profile-additionals">
        <div class="studentClubs">
          <h5><u> Student Clubs </u></h5>
        </div>
        <div class="skills">
          <h5><u> Skills</u></h5>
        </div>
      </div>
    </div>

    <div v-if="pageStatus == 0">
      <div class="header-profile">
        <v-img
          :src="userPhoto"
          max-height="110"
          max-width="110"
          class="profile-img"
        >
        </v-img>
        &nbsp; &nbsp; &nbsp;
        <div class="edit-profile-section header-input">
          <h5>First Name</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userFirstName"
            id="firstnameinput"
          />
          <br />
        </div>
        <div class="edit-profile-section header-input">
          <h5>Last Name</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userLastName"
            id="lastnameinput"
          />
          <br />
        </div>
      </div>
      <div class="edit-profile-main">
        <div class="edit-profile-section">
          <h5>Student Email</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userEmail"
            id="emailinput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5>Student BU ID &nbsp; (U12345678)</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userBUID"
            id="buidinput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5>Phone Number</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userPhone"
            id="phonenumberinput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5>Graduation Date &nbsp; (MM/YY)</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userGrad"
            id="graudationinput"
          />
          <br />
        </div>

        <div class="edit-profile-section">
          <h5>Major</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userMajor"
            id="majorinput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5>Minor</h5>
          <input
            class="profile-edit-input"
            type="text"
            v-model="userMinor"
            id="minorinput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5>Gender</h5>
          <v-select
            :items="genderOptions"
            class="profile-edit-input-select"
            solo
            id="genderinput"
            :label="userGender"
          ></v-select>
        </div>
        <div class="edit-profile-section">
          <h5>School Year</h5>
          <v-select
            :items="schoolYearOptions"
            class="profile-edit-input-select"
            solo
            id="schoolYearInput"
            :label="userSchoolYr"
          ></v-select>
          <br />
        </div>
      </div>
      <br />
      <div class="edit-profile-links">
        <div class="edit-profile-section">
          <h5><v-icon>mdi-github</v-icon>&nbsp; GitHub Link</h5>
          <input
            class="profile-edit-input-link"
            type="text"
            v-model="userGitHub"
            id="githubinput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5><v-icon>mdi-linkedin</v-icon>&nbsp; LinekdIn Profile</h5>
          <input
            class="profile-edit-input-link"
            type="text"
            v-model="userLinkedIn"
            id="linkedininput"
          />
          <br />
        </div>
        <div class="edit-profile-section">
          <h5><v-icon>mdi-link</v-icon>&nbsp; Other Links</h5>
          <input
            class="profile-edit-input-link"
            type="text"
            v-model="userLink"
            id="otherlinkinput"
          />
          <br />
        </div>
      </div>
      <br />
      <v-btn class="submit-profile-btn" @click="updatePageStatus(0)">
        Submit
      </v-btn>
      <div class="profile-edit-additionals">
        <div class="studentClubs">
          <h5><u> Student Clubs </u></h5>
          <v-btn class="check-btn" elevation="0" @click="addNewClub()">
            <v-icon aria-hidden="false"> mdi-check-outline </v-icon>
          </v-btn>
          <input type="text" placeholder="Add New Club" id="newclubnameinput" />
          <input type="text" placeholder="Member" id="newclubpositioninput" />
        </div>
        <br />
        <span id="populatedStudentClubs">
          <!-- TO BE POPULATED FROM FIREBASE -->
        </span>
        <div class="skills">
          <h5><u> Skills</u></h5>
          <v-btn class="check-btn" elevation="0" @click="addNewSkill()">
            <v-icon aria-hidden="false"> mdi-check-outline </v-icon>
          </v-btn>
          <input type="text" placeholder="New Skill" id="newskillinput" />
        </div>
        <br />
        <div id="populatedStudentSkills">
          <!-- TO BaE POPULATED FROM FIREBASE -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";
import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);
Vue.use(Vuex);
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import { db } from "@/firebase/init.js";
export const curPageStatus = new Vue();
export default {
  name: "Profile",
  // props: ["currentPage"],
  components: {},
  data() {
    return {
      pageStatus: 0,
      genderOptions: ["Male", "Female", "Non Binary", "Prefer Not To Answer"],
      schoolYearOptions: [
        "Freshman",
        "Sophomore",
        "Junior",
        "Senior",
        "Grad Student"
      ]
    };
  },
  created() {
    curPageStatus.$on("changePageStatus", cps => {
      this.pageStatus = cps;
    });
    //begin by populating skills:
    if (this.user.skills) {
      var skills = this.user.skills;
      for (let i = 0; i < skills.length; i++) {
        var h5 = document.createElement("h5");
        h5.value = skills[i];
        // htmlskills += '<h5 class="skillElement">' + skills[i] + '</h5>';
        console.log(h5);
        document.getElementById("populatedStudentSkills").append(h5);
      }
      // console.log(htmlskills);
      // document.getElementById("populatedStudentSkills").append(htmlskills);
    }
    //continue by populating clubs:
    if (this.user.clubs) {
      var clubs = this.user.clubs;
      for (let i = 0; i < clubs.length; i++) {
        var h51 = document.createElement("h51");
        h51.value = clubs[i];
        // htmlclubs += '<h5 class="clubElement">' + clubs[i] + '</h5>';
        console.log(h51);
        document.getElementById("populatedStudentClubs").append(h51);
      }
      // document.getElementById("populatedStudentClubs").append(htmlclubs);
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userPhoto() {
      if (!this.user.photoURL) return "@/assets/null-profile-img.svg";
      else return this.user.photoURL;
    },
    userEmail() {
      if (!this.user.email) return "";
      else return this.user.email;
    },
    userFirstName() {
      if (!this.user.firstname) return "";
      else return this.user.firstname;
    },
    userLastName() {
      if (!this.user.lastname) return "";
      else return this.user.lastname;
    },
    userBUID() {
      if (!this.user.buid) return "";
      else return this.user.buid;
    },
    userPhone() {
      if (!this.user.phone) return "";
      else return this.user.phone;
    },
    userGender() {
      if (!this.user.gender) return "";
      else return this.user.gender;
    },
    userMajor() {
      if (!this.user.major) return "";
      else return this.user.major;
    },
    userMinor() {
      if (!this.user.minor) return "";
      else return this.user.minor;
    },
    userSchoolYr() {
      if (!this.user.schoolyear) return "";
      else return this.user.schoolyear;
    },
    userGrad() {
      if (!this.user.graduation) return "";
      else return this.user.graduation;
    },
    userGitHub() {
      if (!this.user.github) return "";
      else return this.user.github;
    },
    userLinkedIn() {
      if (!this.user.linkedin) return "";
      else return this.user.linkedin;
    },
    userLink() {
      if (!this.user.otherlink) return "";
      else return this.user.otherlink;
    },
    userClubs() {
      if (!this.user.clubs) return "";
      else return this.user.clubs;
    },
    userSkills() {
      if (!this.user.skills) return "";
      else return this.user.skills;
    }
  },
  methods: {
    // startNewApp: this.$router.push("@/views/NotFound.vue")
    updatePageStatus(pageStatus) {
      curPageStatus.$emit("changePageStatus", pageStatus);
      if (pageStatus == 0) {
        //this means that the submit new information button was clicked
        const toifirstname = document.getElementById("firstnameinput").value;
        const toilastname = document.getElementById("lastnameinput").value;
        const toiemail = document.getElementById("emailinput").value;
        const toibuid = document.getElementById("buidinput").value;
        const toiphonenumber = document.getElementById("phonenumberinput")
          .value;
        const toigender = document.getElementById("genderinput").value;
        const toimajor = document.getElementById("majorinput").value;
        const toiminor = document.getElementById("minorinput").value;
        const toischoolyr = document.getElementById("schoolYearInput").value;
        const toigithub = document.getElementById("githubinput").value;
        const toilinkedin = document.getElementById("linkedininput").value;
        const toiotherlink = document.getElementById("otherlinkinput").value;
        const toigraduation = document.getElementById("graudationinput").value;
        const userRef = db.collection("users").doc(this.user.uid);
        userRef
          .set(
            {
              firstname: toifirstname,
              lastname: toilastname,
              email: toiemail,
              buid: toibuid,
              phone: toiphonenumber,
              gender: toigender,
              major: toimajor,
              minor: toiminor,
              schoolyear: toischoolyr,
              github: toigithub,
              linkedin: toilinkedin,
              otherlink: toiotherlink,
              graudation: toigraduation
              // clubs: toiclubs
            },
            { merge: true }
          )
          .then(() => {
            console.log("updated database successfully");
            this.$router.go();
          });
      }
    },
    addNewClub() {
      const name = document.getElementById("newclubnameinput").value;
      var position = document.getElementById("newclubpositioninput").value;
      if (position == "") {
        position = "Member";
      }
      const club = name + ":\t" + position;
      var toiclubs = [];
      if (!this.user.clubs) {
        toiclubs = [club];
      } else {
        toiclubs = this.user.clubs;
        toiclubs.push(club);
      }
      const userRef = db.collection("users").doc(this.user.uid);
      userRef
        .set(
          {
            clubs: toiclubs
          },
          { merge: true }
        )
        .then(() => {
          console.log("updated database successfully");
          document.getElementById("newclubnameinput").value = "";
          document.getElementById("newclubpositioninput").value = "";
        });
    },
    addNewSkill() {
      const skill = document.getElementById("newskillinput").value;
      var toiskills = [];
      if (!this.user.skills) {
        toiskills = [skill];
      } else {
        toiskills = this.user.skills;
        toiskills.push(skill);
      }
      console.log(toiskills);
      const userRef = db.collection("users").doc(this.user.uid);
      userRef
        .set(
          {
            skills: toiskills
          },
          { merge: true }
        )
        .then(() => {
          console.log("updated database successfully");
          document.getElementById("newskillinput").value = "";
        });
    }
  },
  mounted() {}
};
</script>

<style scoped>
.header-input {
  flex: 5;
  text-align: left !important;
  width: 90% !important;
  margin-right: 10px !important;
  padding-right: 3% !important;
}
.profile-img {
  border-radius: 150px !important;
  flex: 2;
}
div.edit-profile-main {
  display: grid;
  text-align: left;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  position: static;
}
div.edit-profile-links {
  display: flex;
  width: 100%;
  text-align: left;
  /* justify-content: space-between; */
}
div.edit-profile-links div.edit-profile-section {
  margin-right: 10px;
  flex-grow: 1 !important;
}
div.body-profile-edit {
  text-align: left;
  padding-left: 1%;
}
input.profile-edit-input {
  border-radius: 5px;
  background-color: rgb(247, 249, 253);
  padding: 6px 12px;
  width: 90%;
}
input.profile-edit-input-link {
  border-radius: 5px;
  background-color: rgb(247, 249, 253);
  padding: 6px 12px;
  width: 90%;
}
.profile-edit-input-select {
  width: 90% !important;
  /* background-color: rgb(247, 249, 253); */
}
.v-input__slot {
  width: 90% !important;
}
.check-btn {
  color: #36bd90 !important;
  border-radius: 150px !important;
  background-color: transparent !important;
}
.profile-additionals,
.profile-edit-additionals {
  text-align: left !important;
  margin-top: 15px !important;
}
.body-profile h5 {
  margin: 0px !important;
  text-align: left !important;
  padding: 2px 5px !important;
}
#main-container {
  border-radius: 25px;
  background-color: rgb(227, 227, 255);
  color: black;
  font-weight: 750;
  padding: 25px;
  min-height: 570px !important;
  margin: 10px;
  text-align: center;
}
.header-profile {
  display: flex;
  /* grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr); */
  position: static;
  margin-bottom: 25px;
  align-items: center;
}
.submit-profile-btn {
  background-color: #36bd90 !important;
  color: rgb(247, 249, 253) !important;
  font-weight: 900 !important;
  width: 25% !important;
  font-size: 105%;
}
.edit-profile-btn {
  background-color: #ffc65d !important;
  width: 170px !important;
}
v-btn {
  color: #e7f1ee;
}
</style>
