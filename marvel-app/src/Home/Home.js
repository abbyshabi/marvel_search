import React, { useEffect, useState, useCallback } from 'react'
import { fetchCharacters, fetchSuggestions } from '../api'
import Pagination from '../Pagination'
import Search from '../Search/index.js'
import { TailSpin } from 'react-loader-spinner'
import './home.css'

function Home () {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const charactersPerPage = 20
  const [searchQuery, setSearchQuery] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState('')

  const triggerSearch = useCallback(
    (query = searchQuery) => {
      setIsLoading(true)
      setNoResultsMessage('')
      const offset = (currentPage - 1) * charactersPerPage

      fetchCharacters(query, offset, charactersPerPage)
        .then(res => {
          const data = res?.data?.data
          const results = data?.results || []

          setCharacters(results)
          setTotalPages(Math.ceil(data?.total / charactersPerPage))

          if (results.length === 0) {
            setNoResultsMessage(`No results found for "${query}".`)
          }

          setIsLoading(false)
        })
        .catch(err => {
          console.error(err)
          setNoResultsMessage(
            'An error occurred while fetching data. Please try again.'
          )
          setIsLoading(false)
        })
    },
    [searchQuery, currentPage, charactersPerPage]
  )

  useEffect(() => {
    triggerSearch() // Automatically fetch characters on component mount
  }, [triggerSearch])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when search query changes
  }, [searchQuery])

  const defaultImage =
    'https://dummyimage.com/200x300/cccccc/000000&text=Image+Not+Available'

  return (
    <div className='home-container'>
      <div className='marvel-background'>
        <img
          src='https://www.citypng.com/public/uploads/preview/marvel-entertainment-logo-png-701751694711701sy4mtyexji.png'
          alt='Marvel Logo'
          className='marvel-logo'
        />
        <h1>Marvel Characters</h1>
      </div>
      <div className='search_bar'>
        <Search
          className=''
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          triggerSearch={triggerSearch}
          fetchSuggestions={fetchSuggestions}
        />
      </div>
      {isLoading ? (
        <div className='loading-container'>
          <TailSpin
            height='80'
            width='80'
            color='#3b82f6'
            ariaLabel='loading'
          />
        </div>
      ) : (
        <>
          {noResultsMessage ? (
            <div className='no-results-message-container'>
              <p className='no-results-message'>{noResultsMessage}</p>
              <p className='suggestion-message'>
                Try searching for another character or check your spelling.
              </p>
            </div>
          ) : (
            <>
              <ul>
                {characters.map(char => {
                  const imageUrl = char?.thumbnail?.path.includes(
                    'image_not_available'
                  )
                    ? defaultImage
                    : `${char?.thumbnail?.path}.${char?.thumbnail?.extension}`

                  return (
                    <li key={char?.id}>
                      <h2>{char?.name}</h2>
                      <img src={imageUrl} alt={`${char?.name} Thumbnail`} />
                    </li>
                  )
                })}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => {
                  setCurrentPage(page)
                  triggerSearch(searchQuery) // Use updated query
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Home
