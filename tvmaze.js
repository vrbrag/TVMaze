"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShows(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let res = await axios.get('http://api.tvmaze.com/search/shows/', {
    params: { q: term }
  })
  // console.log(res.data)

  let shows = res.data.map(results => {
    let show = results.show
    console.log(show)
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : "http://tinyurl.com/missing-tv"
    }
  })
  return shows
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-black btn-sm get-episodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

$searchForm.on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val()
  if (!query) return

  $episodesArea.hide();

  let shows = await searchShows(query)

  populateShows(shows)
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  console.log(res.data)
  let episodes = res.data.map(episode => ({

    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }
  ))
  console.log(episodes)
  return episodes


}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list')

  $episodesList.empty()
  for (let episode of episodes) {
    let $item = $(
      `<li>
        ${episode.name} (season ${episode.season}, number ${episode.number})
      </li>`
    )
    $episodesList.append($item)
  }
  $episodesArea.show();
}

$showsList.on('click', '.get-episodes', async function handleEpisode(e) {

  let id = $(e.target).closest('.Show').data('show-id')
  // console.log(id)
  let episodes = await getEpisodesOfShow(id)
  populateEpisodes(episodes)
})
