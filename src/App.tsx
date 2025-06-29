import Grid from './components/Grid';
import GridFooter from './components/GridFooter';
import GridHeader from './components/GridHeader';
import GridRows from './components/GridRows';
import GridSearch from './components/GridSearch';
import { type GridColumnInit } from './state/gridStore';

const columns: Array<GridColumnInit> = [
  {
    displayName: "Date",
    cellType: 'date',
    fieldName: 'date_test',
    isEditable: true,
    isSearchable: true,
    inputProps: { type: 'date', min: "2025-04-01", max: "2028-04-30", className: "bg-transparent w-full h-full pl-4 outline-none" },
    displayValueTransformer: (value: string) => new Date(value).toLocaleDateString('en-AU'),
    displayClassName: "flex-auto flex items-center justify-between px-8 w-full h-full",
  },
  {
    displayName: "Time",
    cellType: 'time',
    fieldName: 'time_test',
    isEditable: true,
    inputProps: { type: 'time', min: "08:00", max: "17:30", className: "bg-transparent w-full h-full pl-4 outline-none" },
    displayClassName: "flex-auto flex items-center justify-between px-8 w-full h-full",
  },
  {
    displayName: "Name",
    cellType: 'text',
    fieldName: 'text_test',
    isSearchable: true,
    isSortable: true,
    displayClassName: "flex-auto flex items-center justify-between px-8 w-full h-full",
  },
  {
    displayName: "Email",
    cellType: 'email',
    fieldName: 'email_test',
    isEditable: true,
    isSearchable: true,
    isSortable: true,
    inputProps: { type: 'email', pattern: '.+@example\.com', placeholder: 'test@gridlock.com', className: "bg-transparent w-full h-full pl-4 outline-none" },
    displayClassName: "flex-auto flex items-center justify-between px-2 w-full h-full",
    cellValidator: (value: string) => (new RegExp(/^\w+@\w+\.\w+$/)).test(value),
  },
]


const App = () => {
  const data = [
    {
      date_test: "2025-04-25", // for html date input
      time_test: "11:00", // for html time input
      text_test: "Dave", // first name
      email_test: "dave@grid.lock" // email
    },
    {
      date_test: "2025-04-26",
      time_test: "09:15",
      text_test: "Sarah",
      email_test: "sarah@example.com"
    },
    {
      date_test: "2025-04-27",
      time_test: "14:30",
      text_test: "Miguel",
      email_test: "miguel@test.org"
    },
    {
      date_test: "2025-04-28",
      time_test: "08:45",
      text_test: "Priya",
      email_test: "priya@company.io"
    },
    {
      date_test: "2025-04-29",
      time_test: "16:20",
      text_test: "Jordan",
      email_test: "jordan@mail.dev"
    },
    {
      date_test: "2025-04-30",
      time_test: "10:30",
      text_test: "Emma",
      email_test: "emma@webmail.net"
    },
    {
      date_test: "2025-05-01",
      time_test: "13:15",
      text_test: "Liam",
      email_test: "liam@inbox.co"
    },
    {
      date_test: "2025-05-02",
      time_test: "09:45",
      text_test: "Aisha",
      email_test: "aisha@domain.com"
    },
    {
      date_test: "2025-05-03",
      time_test: "17:00",
      text_test: "Noah",
      email_test: "noah@service.io"
    },
    {
      date_test: "2025-05-04",
      time_test: "12:30",
      text_test: "Sofia",
      email_test: "sofia@connect.net"
    },
    {
      date_test: "2025-05-05",
      time_test: "08:00",
      text_test: "Jackson",
      email_test: "jackson@email.org"
    },
    {
      date_test: "2025-05-06",
      time_test: "14:45",
      text_test: "Olivia",
      email_test: "olivia@mailbox.com"
    },
    {
      date_test: "2025-05-07",
      time_test: "11:20",
      text_test: "Lucas",
      email_test: "lucas@server.io"
    },
    {
      date_test: "2025-05-08",
      time_test: "15:30",
      text_test: "Mia",
      email_test: "mia@contact.co"
    },
    {
      date_test: "2025-05-09",
      time_test: "10:15",
      text_test: "Ethan",
      email_test: "ethan@message.net"
    },
    {
      date_test: "2025-05-10",
      time_test: "13:45",
      text_test: "Ava",
      email_test: "ava@inbox.org"
    },
    {
      date_test: "2025-05-11",
      time_test: "09:30",
      text_test: "Logan",
      email_test: "logan@webmail.io"
    },
    {
      date_test: "2025-05-12",
      time_test: "16:15",
      text_test: "Isabella",
      email_test: "isabella@domain.net"
    },
    {
      date_test: "2025-05-13",
      time_test: "11:45",
      text_test: "Mason",
      email_test: "mason@mail.com"
    },
    {
      date_test: "2025-05-14",
      time_test: "14:00",
      text_test: "Zoe",
      email_test: "zoe@connect.io"
    },
    {
      date_test: "2025-05-15",
      time_test: "08:30",
      text_test: "James",
      email_test: "james@service.org"
    },
    {
      date_test: "2025-05-16",
      time_test: "15:45",
      text_test: "Charlotte",
      email_test: "charlotte@mailbox.net"
    },
    {
      date_test: "2025-05-17",
      time_test: "10:00",
      text_test: "Benjamin",
      email_test: "benjamin@email.co"
    },
    {
      date_test: "2025-05-18",
      time_test: "12:45",
      text_test: "Lily",
      email_test: "lily@server.com"
    },
    {
      date_test: "2025-05-19",
      time_test: "17:30",
      text_test: "William",
      email_test: "william@contact.io"
    },
    {
      date_test: "2025-05-20",
      time_test: "09:15",
      text_test: "Amelia",
      email_test: "amelia@message.org"
    },
    {
      date_test: "2025-05-21",
      time_test: "14:30",
      text_test: "Elijah",
      email_test: "elijah@inbox.net"
    },
    {
      date_test: "2025-05-22",
      time_test: "11:10",
      text_test: "Harper",
      email_test: "harper@domain.io"
    },
    {
      date_test: "2025-05-23",
      time_test: "16:00",
      text_test: "Henry",
      email_test: "henry@webmail.com"
    },
    {
      date_test: "2025-05-24",
      time_test: "13:20",
      text_test: "Evelyn",
      email_test: "evelyn@mail.org"
    },
    {
      date_test: "2025-05-25",
      time_test: "08:45",
      text_test: "Sebastian",
      email_test: "sebastian@connect.net"
    },
    {
      date_test: "2025-05-26",
      time_test: "15:15",
      text_test: "Abigail",
      email_test: "abigail@service.co"
    },
    {
      date_test: "2025-05-27",
      time_test: "10:30",
      text_test: "Alexander",
      email_test: "alexander@email.io"
    },
    {
      date_test: "2025-05-28",
      time_test: "14:45",
      text_test: "Emily",
      email_test: "emily@mailbox.org"
    },
    {
      date_test: "2025-05-29",
      time_test: "09:00",
      text_test: "Daniel",
      email_test: "daniel@server.net"
    },
    {
      date_test: "2025-05-30",
      time_test: "16:30",
      text_test: "Elizabeth",
      email_test: "elizabeth@contact.com"
    },
    {
      date_test: "2025-05-31",
      time_test: "11:45",
      text_test: "Matthew",
      email_test: "matthew@message.io"
    },
    {
      date_test: "2025-06-01",
      time_test: "13:00",
      text_test: "Avery",
      email_test: "avery@inbox.org"
    },
    {
      date_test: "2025-06-02",
      time_test: "08:15",
      text_test: "Joseph",
      email_test: "joseph@domain.net"
    },
    {
      date_test: "2025-06-03",
      time_test: "15:30",
      text_test: "Sofia",
      email_test: "sofia@webmail.co"
    },
    {
      date_test: "2025-06-04",
      time_test: "10:45",
      text_test: "Samuel",
      email_test: "samuel@mail.io"
    },
    {
      date_test: "2025-06-05",
      time_test: "17:15",
      text_test: "Chloe",
      email_test: "chloe@connect.org"
    },
    {
      date_test: "2025-06-06",
      time_test: "09:30",
      text_test: "David",
      email_test: "david@service.net"
    },
    {
      date_test: "2025-06-07",
      time_test: "14:00",
      text_test: "Grace",
      email_test: "grace@email.com"
    },
    {
      date_test: "2025-06-08",
      time_test: "11:20",
      text_test: "John",
      email_test: "john@mailbox.io"
    },
    {
      date_test: "2025-06-09",
      time_test: "16:45",
      text_test: "Scarlett",
      email_test: "scarlett@server.org"
    },
    {
      date_test: "2025-06-10",
      time_test: "08:30",
      text_test: "Andrew",
      email_test: "andrew@contact.net"
    },
    {
      date_test: "2025-06-11",
      time_test: "13:15",
      text_test: "Victoria",
      email_test: "victoria@message.co"
    },
    {
      date_test: "2025-06-12",
      time_test: "10:00",
      text_test: "Christopher",
      email_test: "christopher@inbox.com"
    },
    {
      date_test: "2025-06-13",
      time_test: "15:45",
      text_test: "Penelope",
      email_test: "penelope@domain.io"
    },
    {
      date_test: "2025-06-14",
      time_test: "12:30",
      text_test: "Thomas",
      email_test: "thomas@webmail.org"
    },
    {
      date_test: "2025-06-15",
      time_test: "17:00",
      text_test: "Riley",
      email_test: "riley@mail.net"
    },
    {
      date_test: "2025-06-16",
      time_test: "09:45",
      text_test: "Jack",
      email_test: "jack@connect.co"
    },
    {
      date_test: "2025-06-17",
      time_test: "14:15",
      text_test: "Layla",
      email_test: "layla@service.com"
    },
    {
      date_test: "2025-06-18",
      time_test: "11:30",
      text_test: "Ryan",
      email_test: "ryan@email.io"
    },
    {
      date_test: "2025-06-19",
      time_test: "16:00",
      text_test: "Nora",
      email_test: "nora@mailbox.net"
    },
    {
      date_test: "2025-06-20",
      time_test: "08:45",
      text_test: "Nicholas",
      email_test: "nicholas@server.co"
    },
    {
      date_test: "2025-06-21",
      time_test: "13:30",
      text_test: "Zoey",
      email_test: "zoey@contact.org"
    },
    {
      date_test: "2025-06-22",
      time_test: "10:15",
      text_test: "Christian",
      email_test: "christian@message.net"
    },
    {
      date_test: "2025-06-23",
      time_test: "15:00",
      text_test: "Audrey",
      email_test: "audrey@inbox.io"
    },
    {
      date_test: "2025-06-24",
      time_test: "12:45",
      text_test: "Jonathan",
      email_test: "jonathan@domain.com"
    },
    {
      date_test: "2025-06-25",
      time_test: "17:30",
      text_test: "Claire",
      email_test: "claire@webmail.org"
    },
    {
      date_test: "2025-06-26",
      time_test: "09:00",
      text_test: "Nathan",
      email_test: "nathan@mail.co"
    },
    {
      date_test: "2025-06-27",
      time_test: "14:45",
      text_test: "Stella",
      email_test: "stella@connect.net"
    },
    {
      date_test: "2025-06-28",
      time_test: "11:15",
      text_test: "Isaac",
      email_test: "isaac@service.io"
    },
    {
      date_test: "2025-06-29",
      time_test: "16:30",
      text_test: "Hazel",
      email_test: "hazel@email.org"
    },
    {
      date_test: "2025-06-30",
      time_test: "08:15",
      text_test: "Hunter",
      email_test: "hunter@mailbox.com"
    },
    {
      date_test: "2025-07-01",
      time_test: "13:45",
      text_test: "Lucy",
      email_test: "lucy@server.net"
    },
    {
      date_test: "2025-07-02",
      time_test: "10:30",
      text_test: "Carter",
      email_test: "carter@contact.co"
    },
    {
      date_test: "2025-07-03",
      time_test: "15:15",
      text_test: "Aria",
      email_test: "aria@message.io"
    },
    {
      date_test: "2025-07-04",
      time_test: "12:00",
      text_test: "Dylan",
      email_test: "dylan@inbox.org"
    },
    {
      date_test: "2025-07-05",
      time_test: "17:45",
      text_test: "Violet",
      email_test: "violet@domain.net"
    },
    {
      date_test: "2025-07-06",
      time_test: "09:30",
      text_test: "Luke",
      email_test: "luke@webmail.com"
    },
    {
      date_test: "2025-07-07",
      time_test: "14:15",
      text_test: "Luna",
      email_test: "luna@mail.io"
    },
    {
      date_test: "2025-07-08",
      time_test: "11:00",
      text_test: "Owen",
      email_test: "owen@connect.org"
    },
    {
      date_test: "2025-07-09",
      time_test: "16:45",
      text_test: "Ella",
      email_test: "ella@service.net"
    },
    {
      date_test: "2025-07-10",
      time_test: "08:30",
      text_test: "Gabriel",
      email_test: "gabriel@email.co"
    },
    {
      date_test: "2025-07-11",
      time_test: "13:15",
      text_test: "Aurora",
      email_test: "aurora@mailbox.io"
    },
    {
      date_test: "2025-07-12",
      time_test: "10:45",
      text_test: "Anthony",
      email_test: "anthony@server.org"
    },
    {
      date_test: "2025-07-13",
      time_test: "15:30",
      text_test: "Ellie",
      email_test: "ellie@contact.com"
    },
    {
      date_test: "2025-07-14",
      time_test: "12:15",
      text_test: "Caleb",
      email_test: "caleb@message.net"
    },
    {
      date_test: "2025-07-15",
      time_test: "17:00",
      text_test: "Bella",
      email_test: "bella@inbox.co"
    },
    {
      date_test: "2025-07-16",
      time_test: "09:45",
      text_test: "Adam",
      email_test: "adam@domain.io"
    },
    {
      date_test: "2025-07-17",
      time_test: "14:30",
      text_test: "Hannah",
      email_test: "hannah@webmail.org"
    },
    {
      date_test: "2025-07-18",
      time_test: "11:15",
      text_test: "Evan",
      email_test: "evan@mail.net"
    },
    {
      date_test: "2025-07-19",
      time_test: "16:00",
      text_test: "Taylor",
      email_test: "taylor@connect.com"
    },
    {
      date_test: "2025-07-20",
      time_test: "08:45",
      text_test: "Aaron",
      email_test: "aaron@service.io"
    },
    {
      date_test: "2025-07-21",
      time_test: "13:30",
      text_test: "Nova",
      email_test: "nova@email.org"
    },
    {
      date_test: "2025-07-22",
      time_test: "10:15",
      text_test: "Charles",
      email_test: "charles@mailbox.net"
    },
    {
      date_test: "2025-07-23",
      time_test: "15:45",
      text_test: "Savannah",
      email_test: "savannah@server.co"
    },
    {
      date_test: "2025-07-24",
      time_test: "12:30",
      text_test: "Jason",
      email_test: "jason@contact.io"
    },
    {
      date_test: "2025-07-25",
      time_test: "17:15",
      text_test: "Brooklyn",
      email_test: "brooklyn@message.org"
    },
    {
      date_test: "2025-07-26",
      time_test: "09:00",
      text_test: "Isaiah",
      email_test: "isaiah@inbox.net"
    },
    {
      date_test: "2025-07-27",
      time_test: "14:45",
      text_test: "Naomi",
      email_test: "naomi@domain.com"
    },
    {
      date_test: "2025-07-28",
      time_test: "11:30",
      text_test: "Julian",
      email_test: "julian@webmail.io"
    },
    {
      date_test: "2025-07-29",
      time_test: "16:15",
      text_test: "Alice",
      email_test: "alice@mail.org"
    },
    {
      date_test: "2025-07-30",
      time_test: "08:00",
      text_test: "Eli",
      email_test: "eli@connect.net"
    },
    {
      date_test: "2025-07-31",
      time_test: "13:45",
      text_test: "Madelyn",
      email_test: "madelyn@service.co"
    },
    {
      date_test: "2025-08-01",
      time_test: "10:30",
      text_test: "Leo",
      email_test: "leo@email.io"
    },
    {
      date_test: "2025-08-02",
      time_test: "15:15",
      text_test: "Quinn",
      email_test: "quinn@mailbox.org"
    },
    {
      date_test: "2025-08-03",
      time_test: "12:00",
      text_test: "Adrian",
      email_test: "adrian@server.net"
    },
    {
      date_test: "2025-08-04",
      time_test: "17:45",
      text_test: "Peyton",
      email_test: "peyton@contact.com"
    },
    {
      date_test: "2025-08-05",
      time_test: "09:30",
      text_test: "Hudson",
      email_test: "hudson@message.io"
    },
    {
      date_test: "2025-08-06",
      time_test: "14:15",
      text_test: "Eva",
      email_test: "eva@inbox.net"
    },
    {
      date_test: "2025-08-07",
      time_test: "11:00",
      text_test: "Jose",
      email_test: "jose@domain.org"
    },
    {
      date_test: "2025-08-08",
      time_test: "16:45",
      text_test: "Ivy",
      email_test: "ivy@webmail.co"
    },
    {
      date_test: "2025-08-09",
      time_test: "08:30",
      text_test: "Austin",
      email_test: "austin@mail.com"
    },
    {
      date_test: "2025-08-10",
      time_test: "13:15",
      text_test: "Caroline",
      email_test: "caroline@connect.io"
    },
    {
      date_test: "2025-08-11",
      time_test: "10:45",
      text_test: "Dominic",
      email_test: "dominic@service.org"
    },
    {
      date_test: "2025-08-12",
      time_test: "15:30",
      text_test: "Lydia",
      email_test: "lydia@email.net"
    },
    {
      date_test: "2025-08-13",
      time_test: "12:15",
      text_test: "Blake",
      email_test: "blake@mailbox.co"
    },
    {
      date_test: "2025-08-14",
      time_test: "17:00",
      text_test: "Maya",
      email_test: "maya@server.io"
    },
    {
      date_test: "2025-08-15",
      time_test: "09:45",
      text_test: "Cameron",
      email_test: "cameron@contact.org"
    },
    // Starting batch of entries 100-200
    {
      date_test: "2025-08-16",
      time_test: "14:30",
      text_test: "Aaliyah",
      email_test: "aaliyah@message.com"
    },
    {
      date_test: "2025-08-17",
      time_test: "11:15",
      text_test: "Tyler",
      email_test: "tyler@inbox.io"
    },
    {
      date_test: "2025-08-18",
      time_test: "16:00",
      text_test: "Kinsley",
      email_test: "kinsley@domain.net"
    },
    {
      date_test: "2025-08-19",
      time_test: "08:45",
      text_test: "Jeremiah",
      email_test: "jeremiah@webmail.org"
    },
    {
      date_test: "2025-08-20",
      time_test: "13:30",
      text_test: "Eleanor",
      email_test: "eleanor@mail.co"
    },
    {
      date_test: "2025-08-21",
      time_test: "10:15",
      text_test: "Brandon",
      email_test: "brandon@connect.net"
    },
    {
      date_test: "2025-08-22",
      time_test: "15:45",
      text_test: "Willow",
      email_test: "willow@service.com"
    },
    {
      date_test: "2025-08-23",
      time_test: "12:30",
      text_test: "Kevin",
      email_test: "kevin@email.io"
    },
    {
      date_test: "2025-08-24",
      time_test: "17:15",
      text_test: "Ruby",
      email_test: "ruby@mailbox.org"
    },
    {
      date_test: "2025-08-25",
      time_test: "09:00",
      text_test: "Jordan",
      email_test: "jordan@server.net"
    },
    {
      date_test: "2025-08-26",
      time_test: "14:45",
      text_test: "Leah",
      email_test: "leah@contact.co"
    },
    {
      date_test: "2025-08-27",
      time_test: "11:30",
      text_test: "Ian",
      email_test: "ian@message.io"
    },
    {
      date_test: "2025-08-28",
      time_test: "16:15",
      text_test: "Aubrey",
      email_test: "aubrey@inbox.net"
    },
    {
      date_test: "2025-08-29",
      time_test: "08:00",
      text_test: "Cole",
      email_test: "cole@domain.org"
    },
    {
      date_test: "2025-08-30",
      time_test: "13:45",
      text_test: "Autumn",
      email_test: "autumn@webmail.com"
    },
    {
      date_test: "2025-08-31",
      time_test: "10:30",
      text_test: "Carson",
      email_test: "carson@mail.io"
    },
    {
      date_test: "2025-09-01",
      time_test: "15:15",
      text_test: "Piper",
      email_test: "piper@connect.org"
    },
    {
      date_test: "2025-09-02",
      time_test: "12:00",
      text_test: "Angel",
      email_test: "angel@service.net"
    },
    {
      date_test: "2025-09-03",
      time_test: "17:45",
      text_test: "Genesis",
      email_test: "genesis@email.co"
    },
    {
      date_test: "2025-09-04",
      time_test: "09:30",
      text_test: "Xavier",
      email_test: "xavier@mailbox.io"
    },
    {
      date_test: "2025-09-05",
      time_test: "14:15",
      text_test: "Jade",
      email_test: "jade@server.org"
    },
    {
      date_test: "2025-09-06",
      time_test: "11:00",
      text_test: "Easton",
      email_test: "easton@contact.com"
    },
    {
      date_test: "2025-09-07",
      time_test: "16:45",
      text_test: "Gianna",
      email_test: "gianna@message.net"
    },
    {
      date_test: "2025-09-08",
      time_test: "08:30",
      text_test: "Jaxon",
      email_test: "jaxon@inbox.co"
    },
    {
      date_test: "2025-09-09",
      time_test: "13:15",
      text_test: "Sadie",
      email_test: "sadie@domain.io"
    },
    {
      date_test: "2025-09-10",
      time_test: "10:45",
      text_test: "Cooper",
      email_test: "cooper@webmail.org"
    },
    {
      date_test: "2025-09-11",
      time_test: "15:30",
      text_test: "Nevaeh",
      email_test: "nevaeh@mail.net"
    },
    {
      date_test: "2025-09-12",
      time_test: "12:15",
      text_test: "Parker",
      email_test: "parker@connect.com"
    },
    {
      date_test: "2025-09-13",
      time_test: "17:00",
      text_test: "Elena",
      email_test: "elena@service.io"
    },
    {
      date_test: "2025-09-14",
      time_test: "09:45",
      text_test: "Robert",
      email_test: "robert@email.org"
    },
    {
      date_test: "2025-09-15",
      time_test: "14:30",
      text_test: "Athena",
      email_test: "athena@mailbox.net"
    },
    {
      date_test: "2025-09-16",
      time_test: "11:15",
      text_test: "Connor",
      email_test: "connor@server.co"
    },
    {
      date_test: "2025-09-17",
      time_test: "16:00",
      text_test: "Cora",
      email_test: "cora@contact.io"
    },
    {
      date_test: "2025-09-18",
      time_test: "08:45",
      text_test: "Landon",
      email_test: "landon@message.org"
    }
  ]

  return (
    <div className="font-lex flex items-center justify-center h-screen w-screen">
      <div className='max-w-4xl w-full'>
        <Grid columns={columns} data={data}>
          <label className='block pb-4'>
            <div className='font-semibold'>
              Search
            </div>
            <GridSearch
              placeholder='search by name or email'
              className='py-2 px-4 inset-ring inset-ring-gray-300 rounded-md placeholder:text-gray-500 placeholder:italic placeholder:text-sm' />
          </label>
          <GridHeader />
          <GridRows tableHeight={500} />
          <GridFooter />
        </Grid>
      </div>
    </div>
  );
};

export default App;
