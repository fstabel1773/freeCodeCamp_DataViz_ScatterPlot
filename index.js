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
    // compute windwoWidth (needed for positioning of tooltip)
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
    const specifier = "%M:%S";

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
    // nb: -1/+1 in domain creates little overlapping space on axis
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

    const yScale = d3
      .scaleTime()
      .domain([
        d3.max(data, (d) => d3.timeParse(specifier)(d.Time)),
        d3.min(data, (d) => d3.timeParse(specifier)(d.Time)),
      ])
      .range([h - padding, padding]);

    // axis
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

    // axis-label
    svg
      .append("text")
      .attr("class", "yLabel")
      .attr("text-anchor", "end")
      .attr("y", 20)
      .attr("x", -250)
      .text("Time in Minutes");

    // legend
    const legendItemSize = 25;
    const legendSpacing = 10;
    const yOffset = 75;
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("text-anchor", "end")
      .selectAll(".legendItem")
      .data([0, 1]);

    legend
      .enter()
      .append("rect")
      .attr("class", "legendItem")
      .attr("width", legendItemSize)
      .attr("height", legendItemSize)

      .style("fill", (d) => {
        return d === 1 ? "#ef476f" : "#06d6a0";
      })
      .attr("transform", (d, i) => {
        const x = w - padding;
        const y = yOffset + (legendItemSize + legendSpacing) * i;
        return `translate(${x}, ${y})`;
      });

    legend
      .enter()
      .append("text")
      .attr("x", w - padding - legendSpacing)
      .attr(
        "y",
        (d, i) =>
          yOffset + legendItemSize / 2 + (legendItemSize + legendSpacing) * i
      )
      .style("alignment-baseline", "middle")
      .text((d) =>
        d === 1 ? "Riders with doping allegations" : "No doping allegations"
      );

    // tooltip
    const tooltip = d3
      .select("body")
      .append("g")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const mouseenter = (event, d) => {
      tooltip.style("opacity", 0.9);
    };

    const mouseleave = (event, d) => {
      tooltip.transition().duration(500).style("opacity", 0);
    };

    const mousemove = (event, d) => {
      const [a, b] = d3.pointer(event);

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `<p>${d.Name} (${d.Nationality})</p>
              <p>Year: ${d.Year}, Time: ${d.Time}</p>
              <br>
              <p>${d.Doping}</p>`
        )
        .attr("data-year", new Date(`${d.Year}-01-01`))
        .style("left", (windowWidth - w) / 2 + a + 20 + "px")
        .style("top", (windowHeight - h) / 2 + b - 100 + "px")
        .style("background-color", d.Doping ? "#ef476f" : "#06d6a0");
    };

    // circles
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date(`${d.Year}-01-01`)))
      .attr("cy", (d) => yScale(d3.timeParse(specifier)(d.Time)))
      .attr("r", 10)
      .attr("fill", (d) => {
        return d.Doping ? "#ef476f" : "#06d6a0";
      })
      .attr("class", "dot")
      .attr("data-xvalue", (d) => new Date(`${d.Year}-01-01`))
      .attr("data-yvalue", (d) => d3.timeParse(specifier)(d.Time))
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseenter", mouseenter);
  })
  .catch((error) =>
    console.log("Not able to fetch the data. There was an error: ", error)
  );
