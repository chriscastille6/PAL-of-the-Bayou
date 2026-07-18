/**
 * Expand all <details> (competence scale, BARS) then open the browser print dialog
 * so users can Save as PDF for offline / written ratings.
 */
(function (global) {
  "use strict";

  function printRubricForPdf() {
    var root = document.querySelector(".oral-rubric-page") || document.body;
    root.querySelectorAll("details").forEach(function (d) {
      d.setAttribute("open", "");
    });
    requestAnimationFrame(function () {
      setTimeout(function () {
        window.print();
      }, 50);
    });
  }

  global.printRubricForPdf = printRubricForPdf;
})(typeof window !== "undefined" ? window : this);
