import './App.css';
import { useFetch } from './useFetch';
import { useState, useEffect } from 'react';

// falta arreglar lo del loading

function App() {
  const { data, loading, setData, setLoading } = useFetch("https://api.breakingbadquotes.xyz/v1/quotes");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!loading && data && data.length > 0) {
      let randomIndex = Math.floor(Math.random() * data.length);
      let correctOption = data[randomIndex].author;
      do {
        randomIndex = Math.floor(Math.random() * data.length);
        correctOption = data[randomIndex].author;
      } while (correctOption == "Stephen King")

      const randomOptions = getRandomCharacters(personajes, 4, correctOption);
      const allOptions = [...randomOptions, correctOption];
      const shuffledOptions = shuffleArray(allOptions);

      setOptions(shuffledOptions);
      setSelectedQuote(data[randomIndex].quote);
      setCorrectOption(correctOption)

    }
  }, [data, loading, score]);

  const getRandomCharacters = (array, count, exclude) => {
    const shuffledArray = array
      .filter(item => item.nombre !== exclude)
      .slice()
      .sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, count).map(item => item.nombre);
  };


  const personajes = [
    { nombre: 'Walter White', img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2019/10/walter-white.jpg?tf=3840x' },
    { nombre: 'Saul Goodman', img: 'https://www.cadena3.com/admin/playerswf/fotos/ARCHI_997401.jpg' },
    { nombre: 'Skyler White', img: 'https://es.rollingstone.com/wp-content/uploads/2022/08/Creador-de-Breaking-Bad-lamenta-el-odio-que-recibio-Skyler-White.jpg' },
    { nombre: 'Jesse Pinkman', img: 'https://i.insider.com/5d9f3f5183486904582ee506?width=700' },
    { nombre: 'Gustavo Fring', img: 'https://vader.news/__export/1613258166465/sites/gadgets/img/2021/02/13/gus-fring-breaking-bad.jpg_2111381710.jpg' },
    { nombre: 'Mike Ehrmantraut', img: 'https://indiehoy.com/wp-content/uploads/2019/09/Mike-Ehrmantraut.jpg' },
    { nombre: 'Hank Schrader', img: 'https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/noticias-cine/dean-norris-hank-schrader-tiene-dudas-sobre-better-call-saul/22611226-1-esl-ES/Dean-Norris-Hank-Schrader-tiene-dudas-sobre-Better-Call-Saul.jpg' },
    { nombre: 'Walter White Jr', img: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Walter_White_Jr_S5B.png' },
    { nombre: 'Tuco Salamanca', img: 'https://cdnb.artstation.com/p/assets/images/images/038/225/415/large/ninyorch-tuco-tr-0021.jpg?1622525440' },
    { nombre: 'Badger', img: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/breaking-bad/6/66/Badger.jpg' },
    { nombre: 'The Fly', img: 'https://i.pinimg.com/736x/d5/0a/8b/d50a8b3afff8d6143bd77fa26f7bec80.jpg' }

  ];

  const shuffleArray = array => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleOptionClick = (selectedAuthor, correct, event) => {
    let button = null;
    if (selectedAuthor === correct) {
      if (event.target.parentNode.className == 'button') {
        button = event.target.parentNode;
      }
      else {
        button = event.target;
      }
      button.classList.add("buttonCorrect")
      setTimeout(() => {
        setScore(score + 1)
        setLoading(true);
        fetch("https://api.breakingbadquotes.xyz/v1/quotes")
          .then((response) => response.json())
          .then((data) => setData(data))
          .finally(() => {
            setLoading(false)
            button.classList.remove("buttonCorrect")
          }
          );
      }, 1000)

    } else {

      const dialog = document.getElementById("dialogModal")
      dialog.showModal()
    }
  };

  const handlePlayAgain = () => {

    setScore(0);
    setLoading(true);
    fetch("https://api.breakingbadquotes.xyz/v1/quotes")
      .then((response) => response.json())
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }

  // HTML
  return (
    <div id="divgen" className='div-general'>
      <dialog id="dialogModal">
        <p>Game Over</p>
        <form method="dialog">
          <button onClick={(event) => handlePlayAgain(event)}>Play Again</button>
        </form>
      </dialog>
      <div>
        <h1 className='h1-container'>Guess the quote...</h1>
        <span>
          <h3 className='h3-container'>Who said:</h3>
          <q className='q-container'>{selectedQuote}</q>
        </span>
      </div>
      <div className='div-container'>
        {loading && <h2>Loading...</h2>}
        {options &&
          options.map((author, index) => {
            const character = personajes.find(pj => pj.nombre === author);
            return (
              <button
                key={index}
                className="button"
                onClick={(event) => handleOptionClick(author, correctOption, event)}>
                <img className="configImg" src={character?.img || ''} alt={author} />
                <span className="buttonText">{author}</span>
              </button>
            );
          })}
      </div>
      <div className='score-container'>
        <div className='fondo-container'>
          <h2 className='h2-container'>
            <span className='x-container'>x
            </span>
            <span>{score}</span>
          </h2>
          <img className='img-container' src="/src/assets/meta.png" alt="meta" />
        </div>

      </div>
    </div>
  );
}



export default App;
