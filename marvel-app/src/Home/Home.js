import React, { useEffect, useState } from 'react'
import { fetchCharacters } from '../api'
import Pagination from '../Pagination'
import Search from '../Search/index.js'
import { TailSpin } from 'react-loader-spinner'
import './home.css'

function Home () {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Track loading state
  const [currentPage, setCurrentPage] = useState(1) // Track current page
  const [totalPages, setTotalPages] = useState(0) // Total pages
  const charactersPerPage = 20 // Marvel API default

  useEffect(() => {
    setIsLoading(true) // Show loader
    const offset = (currentPage - 1) * charactersPerPage // Calculate offset

    fetchCharacters(offset, charactersPerPage)
      .then(res => {
        const data = res?.data?.data
        setCharacters(data?.results || [])
        setTotalPages(Math.ceil(data?.total / charactersPerPage)) // Calculate total pages
        setIsLoading(false)
      })

      .catch(err => {
        console.error(err)
        setIsLoading(false) // Stop loading in case of an error
      })
  }, [currentPage])

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const defaultImage =
    'https://dummyimage.com/200x300/cccccc/000000&text=Image+Not+Available'

  return (
    <div>
      <h1>Marvel Characters</h1>
      {/* <Search /> */}
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
            onPageChange={setCurrentPage}
          />
          )
        </>
      )}
    </div>
  )
}

export default Home
