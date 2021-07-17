<template>
  <v-container>
    <DeleteItem
      v-if="this.deleteItem && !this.addItem"
      :schema="schema"
      @deleteItem="changeDeleteItemState()"
      @itemDeleted="deleteField"
    />
    <v-btn
      v-if="!this.deleteItem && !this.addItem"
      @click="changeDeleteItemState()"
      >Delete Item</v-btn
    >

    <AddItem
      v-if="this.addItem && !this.deleteItem"
      :schema="schema"
      @addItem="changeAddItemState()"
      @itemAdded="addField"
    />
    <v-btn
      v-if="!this.addItem && !this.deleteItem"
      @click="changeAddItemState()"
      >Add Item</v-btn
    >

    <FormulateForm class="form-wrapper" v-model="values" :schema="schema" />
    <v-btn @click="submitFormTemplate"> Submit Form Template</v-btn>
  </v-container>
</template>

<script>
import { functions, db } from "@/firebase/init";
import "@/assets/formulate.css";
import AddItem from "@/plugins/AddItem.vue";
import DeleteItem from "@/plugins/DeleteItem.vue";

export default {
  name: "BaseApplicationForm",
  components: {
    AddItem,
    DeleteItem
  },
  data() {
    // let schoolYearList = ["Freshmen", "Sophmore", "Junior", "Senior", "Master"];
    // let clubsList = ["Cool Club", "Very Cool Club", "Cool Cool Club"];
    // let courseList = [
    //   "None",
    //   "Accounting",
    //   "Aerospace Engineering",
    //   "Agricultural Engineering",
    //   "Applied Mathematics",
    //   "Architecture",
    //   "Biochemistry",
    //   "Bioengineering",
    //   "Bioinformatics",
    //   "Biological Sciences",
    //   "Biology",
    //   "Biomedical Engineering",
    //   "Biotechnology",
    //   "Building Construction Management",
    //   "Business",
    //   "Business Administration",
    //   "Business Analytics",
    //   "Chemical Engineering",
    //   "Chemistry",
    //   "Civil Engineering",
    //   "Cognitive Science",
    //   "Communications",
    //   "Computational Biology",
    //   "Computational Media",
    //   "Computer Engineering",
    //   "Computer Science",
    //   "Computer Information Systems",
    //   "Computer Technologies",
    //   "Computing Security",
    //   "Culinary Arts",
    //   "Cyber Operations",
    //   "Data Science",
    //   "Design",
    //   "Economics",
    //   "Electrical Engineering",
    //   "Engineering",
    //   "Engineering Management",
    //   "Engineering Physics",
    //   "Engineering Science",
    //   "English",
    //   "Film",
    //   "Finance",
    //   "Game Design and Development",
    //   "Geophysics",
    //   "Graphic Design",
    //   "Human Centered Design",
    //   "Human Computer Interaction",
    //   "Humanities",
    //   "Individualized Major",
    //   "Industrial and Systems Engineering",
    //   "Industrial and Operations Engineering",
    //   "Industrial Engineering",
    //   "Informatics",
    //   "Information Science",
    //   "Information Systems",
    //   "Information Technology",
    //   "Interaction Design",
    //   "Interactive Multimedia",
    //   "Interactive Telecommunications Program (ITP)",
    //   "International Relations",
    //   "Journalism",
    //   "Linguistics",
    //   "Management",
    //   "Management Information Systems",
    //   "Marketing",
    //   "Materials Science",
    //   "Mathematics",
    //   "Mechanical Engineering",
    //   "Mechatronics",
    //   "Mechatronics Engineering",
    //   "Media Arts and Sciences",
    //   "Music Computing",
    //   "Nanoengineering",
    //   "Network Security",
    //   "Neurobiology/Cognitive Science",
    //   "Neuroscience",
    //   "New Media Design",
    //   "Operations Research Management Science",
    //   "Organizational",
    //   "Philosophy",
    //   "Physics",
    //   "Political Science",
    //   "Poultry Science",
    //   "Product Design",
    //   "Psych",
    //   "Psychology",
    //   "Robotics Engineering",
    //   "Robotics",
    //   "Software Engineering",
    //   "Statistics",
    //   "Systems Design Engineering",
    //   "Technology Management",
    //   "Theatre and Linguistics",
    //   "Undeclared",
    //   "Other"
    // ]
    // let programmingLanguageList = [
    //   "ABAP",
    //   "ActionScript",
    //   "Ada",
    //   "ALGOL",
    //   "Alice",
    //   "APL",
    //   "ASP / ASP.NET",
    //   "Assembly Language",
    //   "Awk",
    //   "BBC Basic",
    //   "C",
    //   "C++",
    //   "C#",
    //   "COBOL",
    //   "Cascading Style Sheets",
    //   "D",
    //   "Delphi",
    //   "Dreamweaver",
    //   "Erlang and Elixir",
    //   "F#",
    //   "FORTH",
    //   "FORTRAN",
    //   "Functional Programming",
    //   "Go",
    //   "Haskell",
    //   "HTML",
    //   "IDL",
    //   "INTERCAL",
    //   "Java",
    //   "Javascript",
    //   "jQuery",
    //   "LabVIEW",
    //   "Lisp",
    //   "Logo",
    //   "MetaQuotes Language",
    //   "ML",
    //   "Modula-3",
    //   "MS Access",
    //   "MySQL",
    //   "NXT-G",
    //   "Object-Oriented Programming",
    //   "Objective-C",
    //   "OCaml",
    //   "Pascal",
    //   "Perl",
    //   "PHP",
    //   "PL/I",
    //   "PL/SQL",
    //   "PostgreSQL",
    //   "PostScript",
    //   "PROLOG",
    //   "Pure Data",
    //   "Python",
    //   "R",
    //   "RapidWeaver",
    //   "RavenDB",
    //   "Rexx",
    //   "Ruby on Rails",
    //   "S-PLUS",
    //   "SAS",
    //   "Scala",
    //   "Sed",
    //   "SGML",
    //   "Simula",
    //   "Smalltalk",
    //   "SMIL",
    //   "SNOBOL",
    //   "SQL",
    //   "SQLite",
    //   "SSI",
    //   "Stata",
    //   "Swift",
    //   "Tcl/Tk",
    //   "TeX and LaTeX",
    //   "Unified Modeling Language",
    //   "Unix Shells",
    //   "Verilog",
    //   "VHDL",
    //   "Visual Basic",
    //   "Visual FoxPro",
    //   "VRML",
    //   "WAP/WML",
    //   "XML",
    //   "XSL"
    // ];
    return {
      addItem: false,
      deleteItem: false,
      value: {},
      schema: [],
      search: null,
      firstName: null,
      lastName: null,
      email: null,
      buID: null,
      gender: null,
      // countryCode: "United States +1",
      phone: null,
      major: null,
      minor: null,
      schoolYear: null,
      graduation: null,
      clubSearch: null,
      clubs: [],
      githubURL: null,
      linkedinURL: null,
      otherURL: null,
      programmingLanguageSearch: null,
      programmingLanguageSkills: [],
      designSearch: null,
      designSkills: [],
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
      requiredRule: [v => !!v || "Input is required."],
      // countryCodeList: [
      //     "Afghanistan (\u202bافغانستان\u202c\u200e) +93",
      //     "Albania (Shqipëri) +355",
      //     "Algeria (\u202bالجزائر\u202c\u200e) +213",
      //     "American Samoa +1",
      //     "Andorra +376",
      //     "Angola +244",
      //     "Anguilla +1",
      //     "Antigua and Barbuda +1",
      //     "Argentina +54",
      //     "Armenia (Հայաստան) +374",
      //     "Aruba +297",
      //     "Australia +61",
      //     "Austria (Österreich) +43",
      //     "Azerbaijan (Azərbaycan) +994",
      //     "Bahamas +1",
      //     "Bahrain (\u202bالبحرين\u202c\u200e) +973",
      //     "Bangladesh (বাংলাদেশ) +880",
      //     "Barbados +1",
      //     "Belarus (Беларусь) +375",
      //     "Belgium (België) +32",
      //     "Belize +501",
      //     "Benin (Bénin) +229",
      //     "Bermuda +1",
      //     "Bhutan (འབྲུག) +975",
      //     "Bolivia +591",
      //     "Bosnia and Herzegovina (Босна и Херцеговина) +387",
      //     "Botswana +267",
      //     "Brazil (Brasil) +55",
      //     "British Indian Ocean Territory +246",
      //     "British Virgin Islands +1",
      //     "Brunei +673",
      //     "Bulgaria (България) +359",
      //     "Burkina Faso +226",
      //     "Burundi (Uburundi) +257",
      //     "Cambodia (កម្ពុជា) +855",
      //     "Cameroon (Cameroun) +237",
      //     "Canada +1",
      //     "Cape Verde (Kabu Verdi) +238",
      //     "Caribbean Netherlands +599",
      //     "Cayman Islands +1",
      //     "Central African Republic (République centrafricaine) +236",
      //     "Chad (Tchad) +235",
      //     "Chile +56",
      //     "China (中国) +86",
      //     "Christmas Island +61",
      //     "Cocos (Keeling) Islands +61",
      //     "Colombia +57",
      //     "Comoros (\u202bجزر القمر\u202c\u200e) +269",
      //     "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo) +243",
      //     "Congo (Republic) (Congo-Brazzaville) +242",
      //     "Cook Islands +682",
      //     "Costa Rica +506",
      //     "Côte d’Ivoire +225",
      //     "Croatia (Hrvatska) +385",
      //     "Cuba +53",
      //     "Curaçao +599",
      //     "Cyprus (Κύπρος) +357",
      //     "Czech Republic (Česká republika) +420",
      //     "Denmark (Danmark) +45",
      //     "Djibouti +253",
      //     "Dominica +1",
      //     "Dominican Republic (República Dominicana) +1",
      //     "Ecuador +593",
      //     "Egypt (\u202bمصر\u202c\u200e) +20",
      //     "El Salvador +503",
      //     "Equatorial Guinea (Guinea Ecuatorial) +240",
      //     "Eritrea +291",
      //     "Estonia (Eesti) +372",
      //     "Ethiopia +251",
      //     "Falkland Islands (Islas Malvinas) +500",
      //     "Faroe Islands (Føroyar) +298",
      //     "Fiji +679",
      //     "Finland (Suomi) +358",
      //     "France +33",
      //     "French Guiana (Guyane française) +594",
      //     "French Polynesia (Polynésie française) +689",
      //     "Gabon +241",
      //     "Gambia +220",
      //     "Georgia (საქართველო) +995",
      //     "Germany (Deutschland) +49",
      //     "Ghana (Gaana) +233",
      //     "Gibraltar +350",
      //     "Greece (Ελλάδα) +30",
      //     "Greenland (Kalaallit Nunaat) +299",
      //     "Grenada +1",
      //     "Guadeloupe +590",
      //     "Guam +1",
      //     "Guatemala +502",
      //     "Guernsey +44",
      //     "Guinea (Guinée) +224",
      //     "Guinea-Bissau (Guiné Bissau) +245",
      //     "Guyana +592",
      //     "Haiti +509",
      //     "Honduras +504",
      //     "Hong Kong (香港) +852",
      //     "Hungary (Magyarország) +36",
      //     "Iceland (Ísland) +354",
      //     "India (भारत) +91",
      //     "Indonesia +62",
      //     "Iran (\u202bایران\u202c\u200e) +98",
      //     "Iraq (\u202bالعراق\u202c\u200e) +964",
      //     "Ireland +353",
      //     "Isle of Man +44",
      //     "Israel (\u202bישראל\u202c\u200e) +972",
      //     "Italy (Italia) +39",
      //     "Jamaica +1",
      //     "Japan (日本) +81",
      //     "Jersey +44",
      //     "Jordan (\u202bالأردن\u202c\u200e) +962",
      //     "Kazakhstan (Казахстан) +7",
      //     "Kenya +254",
      //     "Kiribati +686",
      //     "Kosovo +383",
      //     "Kuwait (\u202bالكويت\u202c\u200e) +965",
      //     "Kyrgyzstan (Кыргызстан) +996",
      //     "Laos (ລາວ) +856",
      //     "Latvia (Latvija) +371",
      //     "Lebanon (\u202bلبنان\u202c\u200e) +961",
      //     "Lesotho +266",
      //     "Liberia +231",
      //     "Libya (\u202bليبيا\u202c\u200e) +218",
      //     "Liechtenstein +423",
      //     "Lithuania (Lietuva) +370",
      //     "Luxembourg +352",
      //     "Macau (澳門) +853",
      //     "Macedonia (FYROM) (Македонија) +389",
      //     "Madagascar (Madagasikara) +261",
      //     "Malawi +265",
      //     "Malaysia +60",
      //     "Maldives +960",
      //     "Mali +223",
      //     "Malta +356",
      //     "Marshall Islands +692",
      //     "Martinique +596",
      //     "Mauritania (\u202bموريتانيا\u202c\u200e) +222",
      //     "Mauritius (Moris) +230",
      //     "Mayotte +262",
      //     "Mexico (México) +52",
      //     "Micronesia +691",
      //     "Moldova (Republica Moldova) +373",
      //     "Monaco +377",
      //     "Mongolia (Монгол) +976",
      //     "Montenegro (Crna Gora) +382",
      //     "Montserrat +1",
      //     "Morocco (\u202bالمغرب\u202c\u200e) +212",
      //     "Mozambique (Moçambique) +258",
      //     "Myanmar (Burma) (မြန်မာ) +95",
      //     "Namibia (Namibië) +264",
      //     "Nauru +674",
      //     "Nepal (नेपाल) +977",
      //     "Netherlands (Nederland) +31",
      //     "New Caledonia (Nouvelle-Calédonie) +687",
      //     "New Zealand +64",
      //     "Nicaragua +505",
      //     "Niger (Nijar) +227",
      //     "Nigeria +234",
      //     "Niue +683",
      //     "Norfolk Island +672",
      //     "North Korea (조선 민주주의 인민 공화국) +850",
      //     "Northern Mariana Islands +1",
      //     "Norway (Norge) +47",
      //     "Oman (\u202bعُمان\u202c\u200e) +968",
      //     "Pakistan (\u202bپاکستان\u202c\u200e) +92",
      //     "Palau +680",
      //     "Palestine (\u202bفلسطين\u202c\u200e) +970",
      //     "Panama (Panamá) +507",
      //     "Papua New Guinea +675",
      //     "Paraguay +595",
      //     "Peru (Perú) +51",
      //     "Philippines +63",
      //     "Poland (Polska) +48",
      //     "Portugal +351",
      //     "Puerto Rico +1",
      //     "Qatar (\u202bقطر\u202c\u200e) +974",
      //     "Réunion (La Réunion) +262",
      //     "Romania (România) +40",
      //     "Russia (Россия) +7",
      //     "Rwanda +250",
      //     "Saint Barthélemy +590",
      //     "Saint Helena +290",
      //     "Saint Kitts and Nevis +1",
      //     "Saint Lucia +1",
      //     "Saint Martin (Saint-Martin (partie française)) +590",
      //     "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon) +508",
      //     "Saint Vincent and the Grenadines +1",
      //     "Samoa +685",
      //     "San Marino +378",
      //     "São Tomé and Príncipe (São Tomé e Príncipe) +239",
      //     "Saudi Arabia (\u202bالمملكة العربية السعودية\u202c\u200e) +966",
      //     "Senegal (Sénégal) +221",
      //     "Serbia (Србија) +381",
      //     "Seychelles +248",
      //     "Sierra Leone +232",
      //     "Singapore +65",
      //     "Sint Maarten +1",
      //     "Slovakia (Slovensko) +421",
      //     "Slovenia (Slovenija) +386",
      //     "Solomon Islands +677",
      //     "Somalia (Soomaaliya) +252",
      //     "South Africa +27",
      //     "South Korea (대한민국) +82",
      //     "South Sudan (\u202bجنوب السودان\u202c\u200e) +211",
      //     "Spain (España) +34",
      //     "Sri Lanka (ශ්\u200dරී ලංකාව) +94",
      //     "Sudan (\u202bالسودان\u202c\u200e) +249",
      //     "Suriname +597",
      //     "Svalbard and Jan Mayen +47",
      //     "Swaziland +268",
      //     "Sweden (Sverige) +46",
      //     "Switzerland (Schweiz) +41",
      //     "Syria (\u202bسوريا\u202c\u200e) +963",
      //     "Taiwan (台灣) +886",
      //     "Tajikistan +992",
      //     "Tanzania +255",
      //     "Thailand (ไทย) +66",
      //     "Timor-Leste +670",
      //     "Togo +228",
      //     "Tokelau +690",
      //     "Tonga +676",
      //     "Trinidad and Tobago +1",
      //     "Tunisia (\u202bتونس\u202c\u200e) +216",
      //     "Turkey (Türkiye) +90",
      //     "Turkmenistan +993",
      //     "Turks and Caicos Islands +1",
      //     "Tuvalu +688",
      //     "U.S. Virgin Islands +1",
      //     "Uganda +256",
      //     "Ukraine (Україна) +380",
      //     "United Arab Emirates (\u202bالإمارات العربية المتحدة\u202c\u200e) +971",
      //     "United Kingdom +44",
      //     "United States +1",
      //     "Uruguay +598",
      //     "Uzbekistan (Oʻzbekiston) +998",
      //     "Vanuatu +678",
      //     "Vatican City (Città del Vaticano) +39",
      //     "Venezuela +58",
      //     "Vietnam (Việt Nam) +84",
      //     "Wallis and Futuna (Wallis-et-Futuna) +681",
      //     "Western Sahara (\u202bالصحراء الغربية\u202c\u200e) +212",
      //     "Yemen (\u202bاليمن\u202c\u200e) +967",
      //     "Zambia +260",
      //     "Zimbabwe +263",
      //     "Åland Islands +358"
      // ],
      valid: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    addField(value) {
      this.schema = value;
    },
    deleteField(value) {
      this.schema = value;
    },
    changeAddItemState() {
      this.addItem = !this.addItem;
      this.deleteItem = false;
    },
    changeDeleteItemState() {
      this.deleteItem = !this.deleteItem;
      this.addItem = false;
    },
    fileUpload(value) {
      if (value == "viewFile") {
        window.open(this.resume[0], "_blank");
      } else if (value == "deleteFile") {
        this.deleteResume();
      } else {
        this.uploadResume(value);
      }
    },
    async submitFormTemplate() {
      // const currentYear = new Date().getFullYear();
      const template = db.collection("applicationTemplate").doc("Base");
      template
        .update({
          [`template.schema`]: this.schema,
          [`template.deadline`]: ""
        })
        .then(() => {
          console.log("submitted");
        })
        .catch(error => {
          console.log(error);
        });
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
        this.buID == null ||
        this.gender == null ||
        // this.countryCode == null ||
        this.phone == null ||
        this.major == null ||
        this.schoolYear == null ||
        this.graduation == null ||
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        ) ||
        !(this.essayAns.split(" ").length <= 200)
      ) {
        this.valid = false;
        return;
      }
      this.valid = true;
    }
  },
  async mounted() {
    const currentYear = new Date().getFullYear();
    const template = db.collection("applicationTemplate").doc("Base");
    template
      .get()
      .then(doc => {
        if (doc.exists) {
          const newestForm = doc.data().FormSchemas[currentYear];
          if (newestForm) {
            this.schema = newestForm;
          } else {
            const lastYear = (parseInt(currentYear) - 1).toString();
            this.schema = doc.data().FormSchemas[lastYear];
          }
        } else {
          template.set({
            [`FormSchemas.${currentYear}`]: {}
          });
        }
      })
      .catch(error => {
        console.log("Error getting document:", error);
      });
  },
  watch: {
    programmingLanguageSkills(val) {
      if (val && val.length > 10) {
        this.$nextTick(() => this.programmingLanguageSkills.pop());
      }
    },
    designSkills(val) {
      if (val && val.length > 10) {
        this.$nextTick(() => this.designSkills.pop());
      }
    },
    clubs(val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.clubs.pop());
      }
    }
  }
};
</script>

<!-- <style scoped>
    /* .formulate-input-element .formulate-input-element--group .formulate-input-group {
        width: 100%;
    }
    
    .formulate-input-group-repeatable {
        width: 100%;
    } */
    
    .form-wrapper {
        padding: 2em;
        border: 1px solid #a8a8a8;
        border-radius: .5em;
        box-sizing: border-box;
    }
    
    .double-row {
        width: 700px;
        color: aqua;
    }
    /* @media (min-width: 650px) {
        .double-row {
            display: flex;
        }
    }
    
    @media (min-width: 720px) {
        .double-row {
            display: block;
        }
    }
    
    @media (min-width: 850px) {
        .double-row {
            display: flex;
        }
        .double-row .formulate-input {
            margin-right: 1.5em;
        }
    }
    */
    
    .formulate-input {
        margin-right: 2em;
        margin-bottom: 0;
        color: aqua;
    }
</style> -->
