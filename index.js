import * as d3 from "https://unpkg.com/d3?module";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((res) => {
    if (!res.ok) {
      throw new Error(response.statusText);
    }
    return res.json();
  })
  .then((data) => {
    // compute windwoWidth
    let windowWidth = document.querySelector("body").clientWidth;
    let windowHeight = document.querySelector("body").clientHeight;
    window.addEventListener("resize", () => {
      windowWidth = document.querySelector("body").clientWidth;
      windowHeight = document.querySelector("body").clientHeight;
    });

    // layout variables
    const w = 1000;
    const h = 700;
    const padding = 70;
    const barwidth = (w - 2 * padding) / data.length;

    //svg container
    const container = d3.select("body").append("div").attr("id", "container");

    container
      .append("div")
      .html(
        "<h1>Doping in Professional Bicycle Racing</h1><h4>35 Fastest times up Alpe d'Huez</h4>"
      )
      .attr("id", "title");

    const svg = container.append("svg").attr("width", w).attr("height", h);

    // scales
    //nb: -1/+1 in domain creates little overlapping space on axis
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => {
          return new Date(`${d.Year - 1}-01-01`);
        }),
        d3.max(data, (d) => {
          return new Date(`${d.Year + 1}-01-01`);
        }),
      ])
      .range([padding, w - padding]);

    const specifier = "%M:%S";
    const parsedTime = data.map((d) => {
      return d3.timeParse(specifier)(d.Time);
    });
    console.log(parsedTime);

    const yScale = d3
      .scaleTime()
      .domain([d3.max(parsedTime), d3.min(parsedTime)])
      .range([h - padding, padding]);

    // // axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d3.timeFormat(specifier)(d));

    svg
      .append("g")
      .attr("transform", `translate(0, ${h - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    svg
      .append("text")
      .attr("class", "yLabel")
      .attr("text-anchor", "end")
      .attr("y", 10)
      .attr("dy", ".75em")
      .attr("x", -250)
      .text("Time in Minutes");

    // // tooltip
    // const tooltip = d3
    //   .select("body")
    //   .append("g")
    //   .attr("id", "tooltip")
    //   .style("opacity", 0);

    // const mouseenter = (event, d) => {
    //   tooltip.style("opacity", 1);
    // };

    // const mouseleave = (event, d) => {
    //   tooltip.transition().duration(500).style("opacity", 0);
    // };

    // const mousemove = (event, d) => {
    //   const [a, b] = d3.pointer(event);
    //   const dataDate = new Date(d[0]);
    //   const year = dataDate.getFullYear();
    //   const quarter = Math.floor((dataDate.getMonth() + 3) / 3);
    //   const gdp = `$ ${d[1]} Billion`;

    //   tooltip.transition().duration(200).style("opacity", 0.9);
    //   tooltip
    //     .html(`<p>${year} Q${quarter}</p><h2>${gdp}</h2>`)
    //     .attr("data-date", d[0])
    //     .style("left", (windowWidth - w) / 2 + a + 20 + "px")
    //     .style("top", (windowHeight - h) / 2 + b - 100 + "px");
    // };

    // // bars
    // svg
    //   .selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   // .attr("x", (d, i) => padding + i * barwidth)
    //   .attr("x", (d, i) => xScale(new Date(d[0])))
    //   .attr("y", (d, i) => yScale(d[1]))
    //   .attr("width", barwidth)
    //   .attr("height", (d, i) => h - padding - yScale(d[1]))
    //   .attr("fill", "#a4161a")
    //   .attr("class", "bar")
    //   .attr("data-date", (d, i) => d[0])
    //   .attr("data-gdp", (d, i) => d[1])
    //   .on("mousemove", mousemove)
    //   .on("mouseleave", mouseleave)
    //   .on("mouseenter", mouseenter);
  })
  .catch((error) =>
    console.log("Not able to fetch the data. There was an error: ", error)
  );
