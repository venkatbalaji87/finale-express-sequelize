const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const helper = require("../src/view/helper/helper");
const path = require("path");
const app = express();
const classDB = require("./config/classDB");
const DarkSky = require("dark-sky");
const darkSky = new DarkSky(process.env.API_KEY);
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
//create a server object:

const hbs = expressHandlebars.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./view/layout"),
  partialsDir: path.join(__dirname, "./view/partial"),
  helpers: {
    helper
  }
});

//basic config to use handlebars.
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
//including __dirname cuz the following line gets called when code is running
app.set("views", path.join(__dirname, "./view"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("homeContent", {
    layout: "hero",
    pageTitle: "Home"
  });
});

app.get("/web/students", async (req, res) => {
  var studentList = [];

  await classDB
    .query(
      `select * from "students" s join "studentMarks" m on s.id = m."studentId" ORDER BY s.id ASC`,
      {
        type: QueryTypes.SELECT
      }
    )
    .then(response => {
      studentList = response;
    });
  res.render("student", {
    layout: "navigation",
    pageTitle: "Students",
    studentList
  });
});

//top-score

app.get("/web/top-score", async (req, res) => {
  var studentList = [];
  var studentList1 = [];
  var studentList2 = [];
  var studentList3 = [];
  var studentList4 = [];

  studentList = await classDB.query(
    `select u.first_name,u.last_name,MAX(p."Physics") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );

  studentList1 = await classDB.query(
    `select u.first_name,u.last_name,MAX(p."Chemistry") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );
  studentList2 = await classDB.query(
    `select u.first_name,u.last_name,MAX(p."Maths") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );
  studentList3 = await classDB.query(
    `select u.first_name,u.last_name,MAX(p."tamil") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );
  studentList4 = await classDB.query(
    `select u.first_name,u.last_name,MAX(p."English") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );

  res.render("topScore", {
    layout: "navigation",
    pageTitle: "Top Scores",
    studentList,
    studentList1,
    studentList2,
    studentList3,
    studentList4
  });
});

//average
app.get("/web/average", async (req, res) => {
  var studentList = [];
  var studentList1 = [];
  var studentList2 = [];
  var studentList3 = [];
  var studentList4 = [];

  studentList = await classDB.query(
    `select u.first_name,u.last_name,AVG(p."Physics") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );

  studentList1 = await classDB.query(
    `select u.first_name,u.last_name, AVG(p."Chemistry") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );
  studentList2 = await classDB.query(
    `select u.first_name,u.last_name,AVG(p."Maths") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );
  studentList3 = await classDB.query(
    `select u.first_name,u.last_name,AVG(p."tamil") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );
  studentList4 = await classDB.query(
    `select u.first_name,u.last_name,AVG(p."English") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );

  res.render("averageScore", {
    layout: "navigation",
    pageTitle: "Average",
    studentList,
    studentList1,
    studentList2,
    studentList3,
    studentList4
  });
});

//overall - top

app.get("/web/overall-top-score", async (req, res) => {
  var studentList = [];

  studentList = await classDB.query(
    `select u.first_name,u.last_name,MAX(p."Physics"+p."Chemistry"+p."Maths"+p."tamil"+p."English") from "students" u join "studentMarks" p on u.id = p."studentId" group by 1,2 order by 3 Desc limit 1`,
    {
      type: QueryTypes.SELECT
    }
  );

  res.render("overallTopScore", {
    layout: "navigation",
    pageTitle: "OverAll Top Score",
    studentList
  });
});

//below-35
app.get("/web/belowmark", async (req, res) => {
  var studentList = [];
  var studentList1 = [];
  var studentList2 = [];
  var studentList3 = [];
  var studentList4 = [];

  studentList = await classDB.query(
    `select * from "students" u join "studentMarks" p on u.id = p."studentId" where p."Physics" < 35`,

    {
      type: QueryTypes.SELECT
    }
  );

  studentList1 = await classDB.query(
    `select * from "students" u join "studentMarks" p on u.id = p."studentId" where p."Chemistry" < 35`,

    {
      type: QueryTypes.SELECT
    }
  );

  studentList2 = await classDB.query(
    `select * from "students" u join "studentMarks" p on u.id = p."studentId" where p."Maths" < 35`,

    {
      type: QueryTypes.SELECT
    }
  );

  studentList3 = await classDB.query(
    `select * from "students" u join "studentMarks" p on u.id = p."studentId" where p."tamil" < 35`,

    {
      type: QueryTypes.SELECT
    }
  );

  studentList4 = await classDB.query(
    `select * from "students" u join "studentMarks" p on u.id = p."studentId" where p."English" < 35`,

    {
      type: QueryTypes.SELECT
    }
  );

  res.render("belowMark", {
    layout: "navigation",
    pageTitle: "Below 35",
    studentList,
    studentList1,
    studentList2,
    studentList3,
    studentList4
  });
});

app.get("/weather", (req, res) => {
  res.render("darkSkyWeather", {
    layout: "hero",
    pageTitle: "weather"
  });
});

app.post("/weather", (req, res) => {
  const lat = req.body.latitude;
  const lon = req.body.longitude;
  res.status(200).json({ message: "Check Weather output tab" });
  let temp = [];
  darkSky
    .latitude(lat)
    .longitude(lon)
    .time(Date.now())
    .units("ca")
    .language("en")
    .exclude("minutely,daily")
    .extendHourly(true)
    .get()
    .then(respo => {
      temp = Object.values(respo);
      console.log(respo);
      const dataweather = classDB.define("Weather", {
        latitude: {
          type: Sequelize.STRING,
          field: "latitude"
        },
        longitude: {
          type: Sequelize.STRING,
          field: "longitude"
        },
        country: {
          type: Sequelize.STRING,
          field: "country"
        },

        time: {
          type: Sequelize.STRING,
          field: "time"
        },
        summary: {
          type: Sequelize.STRING,
          field: "summary"
        },
        icon: {
          type: Sequelize.STRING,
          field: "icon"
        },
        temperature: {
          type: Sequelize.STRING,
          field: "temperature"
        },
        humidity: {
          type: Sequelize.STRING,
          field: "humidity"
        },
        pressure: {
          type: Sequelize.STRING,
          field: "Pressure"
        }
      });
      const weatherinfo = [
        {
          latitude: temp[0],
          longitude: temp[1],
          country: temp[2],
          time: temp[3].time,
          summary: temp[4].summary,
          icon: temp[4].icon,
          temperature: temp[3].temperature,
          humidity: temp[3].humidity,
          pressure: temp[4].pressure
        }
      ];

      console.log(weatherinfo);
      dataweather
        .sync({ force: true })
        .then(() => {
          return dataweather.bulkCreate(weatherinfo, { returning: true });
        })
        .then(result => {
          console.log(result.forEach(item => console.log(item.get())));
        })
        .catch(console.error);

      app.get("/weather/output", async (req, res) => {
        var weatherList = [];
        await classDB
          .query(`SELECT * FROM "public"."Weather" LIMIT 100`, {
            type: QueryTypes.SELECT
          })
          .then(response => {
            weatherList = response;
          });

        res.render("weatheroutput", {
          layout: "hero",
          pageTitle: "Dark Sky Weather for Week",
          weatherList
        });
      });
    })
    .catch(console.log);
});

const server = app.listen(5000, () => {
  console.log(`Server running in port ${server.address().port}`);
});
