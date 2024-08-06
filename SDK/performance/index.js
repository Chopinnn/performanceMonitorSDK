import fetch from "./fetch";
import observeEntries from "./observeEntries";
import observeLCP from "./observeLCP";
import observeFCP from "./observeFCP";
import observeLoad from "./observeLoad";
import observeFP from "./observeFP";
import xhr from "./xhr";   

export default function performance() {
    fetch();
    observeEntries();
    observeLCP();
    observeFCP();
    observeLoad();
    observeFP();
    xhr();
}