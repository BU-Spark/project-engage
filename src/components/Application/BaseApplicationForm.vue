<template>
  <v-container>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1" :editable="editable"
          >Personal Information</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2" :editable="editable"
          >Education</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 3" step="3" :editable="editable"
          >Application Questions</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step step="4" :editable="editable">Consent</v-stepper-step>
      </v-stepper-header>
      <v-form ref="form" lazy-validation>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="smallVertical">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="firstName"
                  label="First Name"
                  :rules="requiredRule"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  :rules="requiredRule"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="email"
                  label="Email"
                  outlined
                  :rules="emailRules"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="gender"
                  :items="genderList"
                  color="primary"
                  label="Gender"
                  outlined
                  :rules="requiredRule"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="pronouns"
                  :items="pronounList"
                  color="primary"
                  label="Pronoun"
                  outlined
                  :rules="requiredRule"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="age"
                  type="number"
                  label="Age"
                  :rules="requiredRule"
                  onkeydown="javascript: return event.keyCode == 69 ? false : true"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="8" sm="4">
                <v-text-field
                  v-model="phone"
                  label="Phone Number"
                  :rules="requiredRule"
                  outlined
                  type="number"
                  onkeydown="javascript: return event.keyCode == 69 ? false : true"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="country"
                  :items="countryList"
                  color="primary"
                  label="Country"
                  :rules="requiredRule"
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-btn color="primary" class="mt-5" @click="e1 = 2">Continue</v-btn>

            <v-btn @click="saveApplication" class="mt-5 ml-5">Save</v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row class="smallVertical">
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="major"
                  :items="courseList"
                  color="primary"
                  label="Major"
                  :rules="requiredRule"
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="minor"
                  :items="courseList"
                  color="primary"
                  label="Minor"
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="educationLevel"
                  :items="educationLevels"
                  color="primary"
                  label="Select your Level of Education (required)"
                  :rules="requiredRule"
                  outlined
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-combobox
                  v-model="language"
                  :items="languageList"
                  :search-input.sync="languageSearch"
                  hide-selected
                  hint="Maximum of 5 tags"
                  label="List proficient programming languages"
                  multiple
                  persistent-hint
                  outlined
                  small-chips
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No results matching "
                          <strong>{{ search }}</strong
                          >". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-col>
            </v-row>

            <v-btn color="primary" class="mt-5" @click="e1 = 3">Continue</v-btn>

            <v-btn @click="saveApplication" class="mt-5 ml-5">Save</v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-textarea
              class="pt-3"
              counter="200"
              :counter-value="wordCounter"
              label="Why do you want to join Spark!? (200 word max) "
              :rules="essayRules.concat(requiredRule)"
              v-model="essayAns"
              outlined
            ></v-textarea>
            <v-text-field
              v-model="githubURL"
              label="Github URL"
              :rules="urlRules"
            ></v-text-field>
            <v-text-field
              v-model="linkedinURL"
              label="LinkedIn URL"
              :rules="urlRules"
            ></v-text-field>
            <v-text-field v-model="otherURL" label="Other URL"></v-text-field>

            <v-btn color="primary" @click="e1 = 4" class="mt-5">Continue</v-btn>

            <v-btn @click="saveApplication" class="mt-5 ml-5">Save</v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <v-switch
              class="pl-3"
              v-model="miniHacks"
              label="Did you attend BostonHacks Virtual MiniHacks 2020?"
            ></v-switch>
            <v-switch
              class="pl-3"
              v-model="marketingData"
              label="Do you consent to your picture or your likeness being used in future BostonHacks marketing material?"
            ></v-switch>
            <v-switch
              class="pl-3"
              v-model="tAndC1"
              label="Do you agree to abide by the MLH code of conduct?"
              :rules="requiredRule"
            >
              <template v-slot:label>
                <div>
                  Do you agree to abide by the
                  <a
                    target="_blank"
                    href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                    @click.stop
                  >
                    MLH code of conduct
                  </a>
                  ？
                </div>
              </template>
            </v-switch>
            <v-switch
              class="pl-3"
              v-model="tAndC3"
              label=""
              :rules="requiredRule"
            >
              <template v-slot:label>
                <div>
                  I authorize you to share my application/registration
                  information for event administration, ranking, MLH
                  administration, pre- and post-event informational e-mails, and
                  occasional messages about hackathons in-line with the
                  <a target="_blank" href="https://mlh.io/privacy" @click.stop>
                    MLH Privacy Policy
                  </a>
                  I further agree to the terms of both the
                  <a
                    target="_blank"
                    href="https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md"
                    @click.stop
                  >
                    MLH Contest Terms and Conditions
                  </a>
                  and the
                  <a target="_blank" href="https://mlh.io/privacy" @click.stop>
                    MLH Privacy Policy
                  </a>
                  .
                </div>
              </template>
            </v-switch>
            <v-switch
              class="pl-3"
              v-model="tAndC2"
              label="Do you agree to abide by the Boston University code of conduct?"
              :rules="requiredRule"
            >
              <template v-slot:label>
                <div>
                  Do you agree to abide by the
                  <a
                    target="_blank"
                    href="http://www.bu.edu/dos/policies/student-responsibilities/"
                    @click.stop
                  >
                    Boston University code of conduct
                  </a>
                  ？
                </div>
              </template>
            </v-switch>
            <v-btn color="primary" class="mt-5" @click="submitApplication"
              >Submit</v-btn
            >

            <v-btn @click="saveApplication" class="mt-5 ml-5">Save</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-form>
      <v-fade-transition>
        <v-overlay v-if="loading == true" absolute color="#c7c3c3">
          <div>
            <bostonHacksLoadingLogo class="loadingSVG" />
          </div>
        </v-overlay>
      </v-fade-transition>
    </v-stepper>
  </v-container>
</template>

<script>
import { functions, db } from "@/firebase/init";
import store from "@/store/index";

export default {
  name: "BaseApplicationForm",
  components: {},
  data() {
    return {
      city: null,
      address: null,
      zip: null,
      countryCode: "United States +1",
      requiredRule: [v => !!v || "Input is required."],
      valid: false,
      languageSearch: null,
      language: [],
      languageList: [
        "ABAP",
        "ActionScript",
        "Ada",
        "ALGOL",
        "Alice",
        "APL",
        "ASP / ASP.NET",
        "Assembly Language",
        "Awk",
        "BBC Basic",
        "C",
        "C++",
        "C#",
        "COBOL",
        "Cascading Style Sheets",
        "D",
        "Delphi",
        "Dreamweaver",
        "Erlang and Elixir",
        "F#",
        "FORTH",
        "FORTRAN",
        "Functional Programming",
        "Go",
        "Haskell",
        "HTML",
        "IDL",
        "INTERCAL",
        "Java",
        "Javascript",
        "jQuery",
        "LabVIEW",
        "Lisp",
        "Logo",
        "MetaQuotes Language",
        "ML",
        "Modula-3",
        "MS Access",
        "MySQL",
        "NXT-G",
        "Object-Oriented Programming",
        "Objective-C",
        "OCaml",
        "Pascal",
        "Perl",
        "PHP",
        "PL/I",
        "PL/SQL",
        "PostgreSQL",
        "PostScript",
        "PROLOG",
        "Pure Data",
        "Python",
        "R",
        "RapidWeaver",
        "RavenDB",
        "Rexx",
        "Ruby on Rails",
        "S-PLUS",
        "SAS",
        "Scala",
        "Sed",
        "SGML",
        "Simula",
        "Smalltalk",
        "SMIL",
        "SNOBOL",
        "SQL",
        "SQLite",
        "SSI",
        "Stata",
        "Swift",
        "Tcl/Tk",
        "TeX and LaTeX",
        "Unified Modeling Language",
        "Unix Shells",
        "Verilog",
        "VHDL",
        "Visual Basic",
        "Visual FoxPro",
        "VRML",
        "WAP/WML",
        "XML",
        "XSL"
      ],
      resumeLoading: false,
      essayRules: [v => v.split(" ").length <= 200 || "Max 200 words!"],
      wordCounter: input => (input ? input.split(" ").length : 0),
      e1: 1,
      loading: false,
      search: null,
      essayAns: "",
      editable: true,
      firstName: null,
      lastName: null,
      phone: null,
      age: null,
      gender: null,
      genderList: ["Female", "Male", "Other"],
      pronouns: null,
      pronounList: ["He/Him", "She/Her", "They/Them"],
      educationLevels: [
        "High School",
        "College Freshman",
        "College Sophomore",
        "College Junior",
        "College Senior",
        "Masters",
        "PhD"
      ],
      educationLevel: null,
      university: null,
      universityList: null,
      major: null,
      minor: null,
      country: null,
      timeZone: null,
      email: null,
      emailRules: [
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Please enter a valid email"
      ],
      urlRules: [
        v =>
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
            v
          ) || "Please enter a valid URL"
      ],
      timeZoneList: [
        "GMT+1:00",
        "GMT+2:00",
        "GMT+3:00",
        "GMT+3:30",
        "GMT+4:00",
        "GMT+5:00",
        "GMT+5:30",
        "GMT+6:00",
        "GMT+7:00",
        "GMT+8:00",
        "GMT+9:00",
        "GMT+9:30",
        "GMT+10:00",
        "GMT+11:00",
        "GMT+12:00",
        "GMT-11:00",
        "GMT-10:00",
        "GMT-9:00",
        "GMT-8:00",
        "GMT-7:00",
        "GMT-6:00",
        "GMT-5:00",
        "GMT-4:00",
        "GMT-3:30",
        "GMT-3:00"
      ],
      countryList: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antigua &amp; Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia &amp; Herzegovina",
        "Botswana",
        "Brazil",
        "British Virgin Islands",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Canada",
        "Cambodia",
        "Cameroon",
        "Cape Verde",
        "Cayman Islands",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Congo",
        "Cook Islands",
        "Costa Rica",
        "Cote D Ivoire",
        "Croatia",
        "Cruise Ship",
        "Cuba",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Polynesia",
        "French West Indies",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea Bissau",
        "Guyana",
        "Haiti",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kuwait",
        "Kyrgyz Republic",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macau",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Nepal",
        "Netherlands",
        "Netherlands Antilles",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Norway",
        "Oman",
        "Pakistan",
        "Palestine",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Reunion",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Pierre &amp; Miquelon",
        "Samoa",
        "San Marino",
        "Satellite",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "South Africa",
        "South Korea",
        "Spain",
        "Sri Lanka",
        "St Kitts &amp; Nevis",
        "St Lucia",
        "St Vincent",
        "St. Lucia",
        "Sudan",
        "Suriname",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor L'Este",
        "Togo",
        "Tonga",
        "Trinidad &amp; Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks &amp; Caicos",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United States",
        "United Kingdom",
        "Uruguay",
        "Uzbekistan",
        "Venezuela",
        "Vietnam",
        "Virgin Islands (US)",
        "Yemen",
        "Zambia",
        "Zimbabwe"
      ],
      courseList: [
        "Accounting",
        "Aerospace Engineering",
        "Agricultural Engineering",
        "Applied Mathematics",
        "Architecture",
        "Biochemistry",
        "Bioengineering",
        "Bioinformatics",
        "Biological Sciences",
        "Biology",
        "Biomedical Engineering",
        "Biotechnology",
        "Building Construction Management",
        "Business",
        "Business Administration",
        "Business Analytics",
        "Chemical Engineering",
        "Chemistry",
        "Civil Engineering",
        "Cognitive Science",
        "Communications",
        "Computational Biology",
        "Computational Media",
        "Computer Engineering",
        "Computer Science",
        "Computer Information Systems",
        "Computer Technologies",
        "Computing Security",
        "Culinary Arts",
        "Cyber Operations",
        "Data Science",
        "Design",
        "Economics",
        "Electrical Engineering",
        "Engineering",
        "Engineering Management",
        "Engineering Physics",
        "Engineering Science",
        "English",
        "Film",
        "Finance",
        "Game Design and Development",
        "Geophysics",
        "Graphic Design",
        "Human Centered Design",
        "Human Computer Interaction",
        "Humanities",
        "Individualized Major",
        "Industrial and Systems Engineering",
        "Industrial and Operations Engineering",
        "Industrial Engineering",
        "Informatics",
        "Information Science",
        "Information Systems",
        "Information Technology",
        "Interaction Design",
        "Interactive Multimedia",
        "Interactive Telecommunications Program (ITP)",
        "International Relations",
        "Journalism",
        "Linguistics",
        "Management",
        "Management Information Systems",
        "Marketing",
        "Materials Science",
        "Mathematics",
        "Mechanical Engineering",
        "Mechatronics",
        "Mechatronics Engineering",
        "Media Arts and Sciences",
        "Music Computing",
        "Nanoengineering",
        "Network Security",
        "Neurobiology/Cognitive Science",
        "Neuroscience",
        "New Media Design",
        "Operations Research Management Science",
        "Organizational",
        "Philosophy",
        "Physics",
        "Political Science",
        "Poultry Science",
        "Product Design",
        "Psych",
        "Psychology",
        "Robotics Engineering",
        "Robotics",
        "Software Engineering",
        "Statistics",
        "Systems Design Engineering",
        "Technology Management",
        "Theatre and Linguistics",
        "Other"
      ],
      uploadedResume: null,
      resume: null,
      githubURL: null,
      linkedinURL: null,
      otherURL: null,
      beenToHackathon: null,
      attendedBHacks: 0,
      miniHacks: 0,
      marketingData: 0,
      tAndC1: 0,
      tAndC2: 0,
      tAndC3: 0,
      countryCodeList: [
        "Afghanistan (\u202bافغانستان\u202c\u200e) +93",
        "Albania (Shqipëri) +355",
        "Algeria (\u202bالجزائر\u202c\u200e) +213",
        "American Samoa +1",
        "Andorra +376",
        "Angola +244",
        "Anguilla +1",
        "Antigua and Barbuda +1",
        "Argentina +54",
        "Armenia (Հայաստան) +374",
        "Aruba +297",
        "Australia +61",
        "Austria (Österreich) +43",
        "Azerbaijan (Azərbaycan) +994",
        "Bahamas +1",
        "Bahrain (\u202bالبحرين\u202c\u200e) +973",
        "Bangladesh (বাংলাদেশ) +880",
        "Barbados +1",
        "Belarus (Беларусь) +375",
        "Belgium (België) +32",
        "Belize +501",
        "Benin (Bénin) +229",
        "Bermuda +1",
        "Bhutan (འབྲུག) +975",
        "Bolivia +591",
        "Bosnia and Herzegovina (Босна и Херцеговина) +387",
        "Botswana +267",
        "Brazil (Brasil) +55",
        "British Indian Ocean Territory +246",
        "British Virgin Islands +1",
        "Brunei +673",
        "Bulgaria (България) +359",
        "Burkina Faso +226",
        "Burundi (Uburundi) +257",
        "Cambodia (កម្ពុជា) +855",
        "Cameroon (Cameroun) +237",
        "Canada +1",
        "Cape Verde (Kabu Verdi) +238",
        "Caribbean Netherlands +599",
        "Cayman Islands +1",
        "Central African Republic (République centrafricaine) +236",
        "Chad (Tchad) +235",
        "Chile +56",
        "China (中国) +86",
        "Christmas Island +61",
        "Cocos (Keeling) Islands +61",
        "Colombia +57",
        "Comoros (\u202bجزر القمر\u202c\u200e) +269",
        "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo) +243",
        "Congo (Republic) (Congo-Brazzaville) +242",
        "Cook Islands +682",
        "Costa Rica +506",
        "Côte d’Ivoire +225",
        "Croatia (Hrvatska) +385",
        "Cuba +53",
        "Curaçao +599",
        "Cyprus (Κύπρος) +357",
        "Czech Republic (Česká republika) +420",
        "Denmark (Danmark) +45",
        "Djibouti +253",
        "Dominica +1",
        "Dominican Republic (República Dominicana) +1",
        "Ecuador +593",
        "Egypt (\u202bمصر\u202c\u200e) +20",
        "El Salvador +503",
        "Equatorial Guinea (Guinea Ecuatorial) +240",
        "Eritrea +291",
        "Estonia (Eesti) +372",
        "Ethiopia +251",
        "Falkland Islands (Islas Malvinas) +500",
        "Faroe Islands (Føroyar) +298",
        "Fiji +679",
        "Finland (Suomi) +358",
        "France +33",
        "French Guiana (Guyane française) +594",
        "French Polynesia (Polynésie française) +689",
        "Gabon +241",
        "Gambia +220",
        "Georgia (საქართველო) +995",
        "Germany (Deutschland) +49",
        "Ghana (Gaana) +233",
        "Gibraltar +350",
        "Greece (Ελλάδα) +30",
        "Greenland (Kalaallit Nunaat) +299",
        "Grenada +1",
        "Guadeloupe +590",
        "Guam +1",
        "Guatemala +502",
        "Guernsey +44",
        "Guinea (Guinée) +224",
        "Guinea-Bissau (Guiné Bissau) +245",
        "Guyana +592",
        "Haiti +509",
        "Honduras +504",
        "Hong Kong (香港) +852",
        "Hungary (Magyarország) +36",
        "Iceland (Ísland) +354",
        "India (भारत) +91",
        "Indonesia +62",
        "Iran (\u202bایران\u202c\u200e) +98",
        "Iraq (\u202bالعراق\u202c\u200e) +964",
        "Ireland +353",
        "Isle of Man +44",
        "Israel (\u202bישראל\u202c\u200e) +972",
        "Italy (Italia) +39",
        "Jamaica +1",
        "Japan (日本) +81",
        "Jersey +44",
        "Jordan (\u202bالأردن\u202c\u200e) +962",
        "Kazakhstan (Казахстан) +7",
        "Kenya +254",
        "Kiribati +686",
        "Kosovo +383",
        "Kuwait (\u202bالكويت\u202c\u200e) +965",
        "Kyrgyzstan (Кыргызстан) +996",
        "Laos (ລາວ) +856",
        "Latvia (Latvija) +371",
        "Lebanon (\u202bلبنان\u202c\u200e) +961",
        "Lesotho +266",
        "Liberia +231",
        "Libya (\u202bليبيا\u202c\u200e) +218",
        "Liechtenstein +423",
        "Lithuania (Lietuva) +370",
        "Luxembourg +352",
        "Macau (澳門) +853",
        "Macedonia (FYROM) (Македонија) +389",
        "Madagascar (Madagasikara) +261",
        "Malawi +265",
        "Malaysia +60",
        "Maldives +960",
        "Mali +223",
        "Malta +356",
        "Marshall Islands +692",
        "Martinique +596",
        "Mauritania (\u202bموريتانيا\u202c\u200e) +222",
        "Mauritius (Moris) +230",
        "Mayotte +262",
        "Mexico (México) +52",
        "Micronesia +691",
        "Moldova (Republica Moldova) +373",
        "Monaco +377",
        "Mongolia (Монгол) +976",
        "Montenegro (Crna Gora) +382",
        "Montserrat +1",
        "Morocco (\u202bالمغرب\u202c\u200e) +212",
        "Mozambique (Moçambique) +258",
        "Myanmar (Burma) (မြန်မာ) +95",
        "Namibia (Namibië) +264",
        "Nauru +674",
        "Nepal (नेपाल) +977",
        "Netherlands (Nederland) +31",
        "New Caledonia (Nouvelle-Calédonie) +687",
        "New Zealand +64",
        "Nicaragua +505",
        "Niger (Nijar) +227",
        "Nigeria +234",
        "Niue +683",
        "Norfolk Island +672",
        "North Korea (조선 민주주의 인민 공화국) +850",
        "Northern Mariana Islands +1",
        "Norway (Norge) +47",
        "Oman (\u202bعُمان\u202c\u200e) +968",
        "Pakistan (\u202bپاکستان\u202c\u200e) +92",
        "Palau +680",
        "Palestine (\u202bفلسطين\u202c\u200e) +970",
        "Panama (Panamá) +507",
        "Papua New Guinea +675",
        "Paraguay +595",
        "Peru (Perú) +51",
        "Philippines +63",
        "Poland (Polska) +48",
        "Portugal +351",
        "Puerto Rico +1",
        "Qatar (\u202bقطر\u202c\u200e) +974",
        "Réunion (La Réunion) +262",
        "Romania (România) +40",
        "Russia (Россия) +7",
        "Rwanda +250",
        "Saint Barthélemy +590",
        "Saint Helena +290",
        "Saint Kitts and Nevis +1",
        "Saint Lucia +1",
        "Saint Martin (Saint-Martin (partie française)) +590",
        "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon) +508",
        "Saint Vincent and the Grenadines +1",
        "Samoa +685",
        "San Marino +378",
        "São Tomé and Príncipe (São Tomé e Príncipe) +239",
        "Saudi Arabia (\u202bالمملكة العربية السعودية\u202c\u200e) +966",
        "Senegal (Sénégal) +221",
        "Serbia (Србија) +381",
        "Seychelles +248",
        "Sierra Leone +232",
        "Singapore +65",
        "Sint Maarten +1",
        "Slovakia (Slovensko) +421",
        "Slovenia (Slovenija) +386",
        "Solomon Islands +677",
        "Somalia (Soomaaliya) +252",
        "South Africa +27",
        "South Korea (대한민국) +82",
        "South Sudan (\u202bجنوب السودان\u202c\u200e) +211",
        "Spain (España) +34",
        "Sri Lanka (ශ්\u200dරී ලංකාව) +94",
        "Sudan (\u202bالسودان\u202c\u200e) +249",
        "Suriname +597",
        "Svalbard and Jan Mayen +47",
        "Swaziland +268",
        "Sweden (Sverige) +46",
        "Switzerland (Schweiz) +41",
        "Syria (\u202bسوريا\u202c\u200e) +963",
        "Taiwan (台灣) +886",
        "Tajikistan +992",
        "Tanzania +255",
        "Thailand (ไทย) +66",
        "Timor-Leste +670",
        "Togo +228",
        "Tokelau +690",
        "Tonga +676",
        "Trinidad and Tobago +1",
        "Tunisia (\u202bتونس\u202c\u200e) +216",
        "Turkey (Türkiye) +90",
        "Turkmenistan +993",
        "Turks and Caicos Islands +1",
        "Tuvalu +688",
        "U.S. Virgin Islands +1",
        "Uganda +256",
        "Ukraine (Україна) +380",
        "United Arab Emirates (\u202bالإمارات العربية المتحدة\u202c\u200e) +971",
        "United Kingdom +44",
        "United States +1",
        "Uruguay +598",
        "Uzbekistan (Oʻzbekiston) +998",
        "Vanuatu +678",
        "Vatican City (Città del Vaticano) +39",
        "Venezuela +58",
        "Vietnam (Việt Nam) +84",
        "Wallis and Futuna (Wallis-et-Futuna) +681",
        "Western Sahara (\u202bالصحراء الغربية\u202c\u200e) +212",
        "Yemen (\u202bاليمن\u202c\u200e) +967",
        "Zambia +260",
        "Zimbabwe +263",
        "Åland Islands +358"
      ]
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    fileUpload(value) {
      if (value == "viewFile") {
        window.open(this.resume[0], "_blank");
      } else if (value == "deleteFile") {
        this.deleteResume();
      } else {
        this.uploadResume(value);
      }
    },
    async saveApplication() {
      this.loading = true;
      const applications = db.collection("applications").doc(this.user.uid);
      await applications.update({
        language: this.language,
        essayAns: this.essayAns,
        firstName: this.firstName,
        lastName: this.lastName,
        timeZone: this.timeZone,
        email: this.email,
        country: this.country,
        countryCode: this.countryCode,
        phone: this.phone,
        age: this.age,
        address: this.address,
        city: this.city,
        zip: this.zip,
        gender: this.gender,
        pronouns: this.pronouns,
        educationLevel: this.educationLevel,
        university: this.university,
        major: this.major,
        minor: this.minor,
        resume: this.resume,
        githubURL: this.githubURL,
        linkedinURL: this.linkedinURL,
        otherURL: this.otherURL,
        beenToHackathon: this.beenToHackathon,
        attendedBHacks: this.attendedBHacks,
        marketingData: this.marketingData,
        miniHacks: this.miniHacks,
        tAndC1: this.tAndC1,
        tAndC2: this.tAndC2,
        tAndC3: this.tAndC3
      });
      this.loading = false;
      this.$router.push({ name: "dashboard" });
    },
    async submitApplication() {
      this.loading = true;
      this.$refs.form.validate();
      this.check();
      if (this.valid) {
        const userdb = db.collection("users").doc(this.user.uid);
        await userdb.update({
          applicationStatus: 1
        });
        const userApplication = db
          .collection("applications")
          .doc(this.user.uid);
        await userApplication.update({
          status: 1,
          uid: this.user.uid,
          language: this.language,
          essayAns: this.essayAns,
          firstName: this.firstName,
          lastName: this.lastName,
          timeZone: this.timeZone,
          country: this.country,
          countryCode: this.countryCode,
          address: this.address,
          city: this.city,
          zip: this.zip,
          email: this.email,
          phone: this.phone,
          age: this.age,
          gender: this.gender,
          pronouns: this.pronouns,
          educationLevel: this.educationLevel,
          university: this.university,
          major: this.major,
          minor: this.minor,
          resume: this.resume,
          githubURL: this.githubURL,
          linkedinURL: this.linkedinURL,
          otherURL: this.otherURL,
          beenToHackathon: this.beenToHackathon,
          attendedBHacks: this.attendedBHacks,
          marketingData: this.marketingData,
          miniHacks: this.miniHacks,
          tAndC1: this.tAndC1,
          tAndC2: this.tAndC2,
          tAndC3: this.tAndC3
        });
        await store.dispatch("getUser");
        this.loading = false;
        this.$router.push({ name: "dashboard" });
      } else {
        this.loading = false;
        this.e1 = 1;
      }
    },
    async uploadResume(value) {
      this.resumeLoading = true;
      this.uploadedResume = value;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedResume[0]);
      reader.onload = async () => {
        functions
          .httpsCallable("uploadResume")({
            file: reader.result.split(",")[1],
            displayName: this.user.displayName,
            type: this.uploadedResume[0].type,
            uid: this.user.uid
          })
          .then(async data => {
            this.resume = [data.data.URL, data.data.location];
            await db
              .collection("applications")
              .doc(this.user.uid)
              .update({
                resume: this.resume
              });
            this.uploadedResume = null;
            this.resumeLoading = false;
          });
      };
    },
    async deleteResume() {
      this.resumeLoading = true;
      await functions.httpsCallable("deleteResume")({
        uid: this.user.uid,
        location: this.resume[1]
      });
      this.resume = null;
      this.resumeLoading = false;
    },
    async check() {
      if (
        this.firstName == null ||
        this.lastName == null ||
        this.phone == null ||
        this.country == null ||
        this.timeZone == null ||
        this.essayAns == "" ||
        this.age == null ||
        this.email == null ||
        this.gender == null ||
        this.pronouns == null ||
        this.educationLevel == null ||
        this.university == null ||
        this.major == null ||
        this.tAndC1 == false ||
        this.tAndC1 == null ||
        this.tAndC2 == false ||
        this.tAndC2 == null ||
        this.tAndC3 == false ||
        this.tAndC3 == null ||
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        ) ||
        !(this.essayAns.split(" ").length <= 200)
      ) {
        this.valid = false;
        return;
      }
      if (this.country == "United States") {
        if (this.address == null || this.city == null || this.zip == null) {
          this.valid = false;
          return;
        }
      }
      this.valid = true;
    }
  },
  async mounted() {
    this.loading = true;
    if (this.user.applicationStatus >= 0) {
      const userApplication = db.collection("applications").doc(this.user.uid);
      var userApplicationDoc = await userApplication.get();
      (this.essayAns = userApplicationDoc.data().essayAns),
        (this.language = userApplicationDoc.data().language),
        (this.firstName = userApplicationDoc.data().firstName),
        (this.lastName = userApplicationDoc.data().lastName),
        (this.country = userApplicationDoc.data().country),
        (this.countryCode = userApplicationDoc.data().countryCode),
        (this.address = userApplicationDoc.data().address),
        (this.zip = userApplicationDoc.data().zip),
        (this.city = userApplicationDoc.data().city),
        (this.email = userApplicationDoc.data().email),
        (this.timeZone = userApplicationDoc.data().timeZone),
        (this.phone = userApplicationDoc.data().phone),
        (this.age = userApplicationDoc.data().age),
        (this.gender = userApplicationDoc.data().gender),
        (this.pronouns = userApplicationDoc.data().pronouns),
        (this.educationLevel = userApplicationDoc.data().educationLevel),
        (this.university = userApplicationDoc.data().university),
        (this.major = userApplicationDoc.data().major),
        (this.minor = userApplicationDoc.data().minor),
        (this.resume = userApplicationDoc.data().resume),
        (this.githubURL = userApplicationDoc.data().githubURL),
        (this.linkedinURL = userApplicationDoc.data().linkedinURL),
        (this.otherURL = userApplicationDoc.data().otherURL),
        (this.beenToHackathon = userApplicationDoc.data().beenToHackathon),
        (this.attendedBHacks = userApplicationDoc.data().attendedBHacks),
        (this.marketingData = userApplicationDoc.data().marketingData),
        (this.tAndC1 = userApplicationDoc.data().tAndC1),
        (this.tAndC2 = userApplicationDoc.data().tAndC2),
        (this.miniHacks = userApplicationDoc.data().miniHacks);
      if (userApplicationDoc.data().tAndC3) {
        this.tAndC3 = userApplicationDoc.data().tAndC3;
      } else {
        this.tAndC3 = false;
      }
    } else {
      const userdb = db.collection("users").doc(this.user.uid);
      await userdb.update({
        applicationStatus: 0
      });
      const userApplication = db.collection("applications").doc(this.user.uid);
      await userApplication.set({
        uid: this.user.uid,
        status: 0,
        firstName: null,
        lastName: null,
        phone: null,
        countryCode: "United States +1",
        country: null,
        email: null,
        timeZone: null,
        address: null,
        city: null,
        zip: null,
        age: null,
        gender: null,
        pronouns: null,
        educationLevel: null,
        university: null,
        language: null,
        essayAns: "",
        major: null,
        minor: null,
        resume: null,
        githubURL: null,
        linkedinURL: null,
        otherURL: null,
        beenToHackathon: null,
        attendedBHacks: false,
        marketingData: false,
        tAndC1: false,
        tAndC2: false,
        tAndC3: false,
        miniHacks: false
      });
      await store.dispatch("getUser");
    }
    this.loading = false;
    fetch(
      "https://raw.githubusercontent.com/MLH/mlh-policies/master/schools.csv"
    )
      .then(response => response.text())
      .then(result => {
        let schoolList = result.split("\n").map(item => {
          item = item.startsWith('"')
            ? item.substring(1, item.length - 2)
            : item;
          return item;
        });
        schoolList.splice(0, 1);
        schoolList.push("Other");
        54;
        this.universityList = schoolList;
      });
  },
  watch: {
    language(val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.language.pop());
      }
    }
  }
};
</script>
