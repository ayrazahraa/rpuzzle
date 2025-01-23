import React, { useState } from 'react';

const SlidingPuzzle = () => {
  const [imagesArr, setImagesArr] = useState([]);
  const [movesCount, setMovesCount] = useState(0);
  const [gameState, setGameState] = useState('landing');

  const randomImages = () => {
    const images = [];
    while (images.length < 8) {
      const randomVal = Math.floor(Math.random() * 8) + 1;
      if (!images.includes(randomVal)) {
        images.push(randomVal);
      }
    }
    images.push(9);
    return images;
  };

  const checkAdjacent = (row1, row2, col1, col2) => {
    if (row1 === row2) {
      return col2 === col1 - 1 || col2 === col1 + 1;
    } else if (col1 === col2) {
      return row2 === row1 - 1 || row2 === row1 + 1;
    }
    return false;
  };

  const getCoords = (position) => {
    return position.split('_').map(Number);
  };

  const startGame = () => {
    setImagesArr(randomImages());
    setMovesCount(0);
    setGameState('playing');
  };

  const selectImage = (currentIndex) => {
    if (gameState !== 'playing') return;

    const currentPos = document.querySelector(`[data-index="${currentIndex}"]`).parentElement.getAttribute('data-position');
    const targetPos = document.querySelector('.target').parentElement.getAttribute('data-position');

    const [row1, col1] = getCoords(currentPos);
    const [row2, col2] = getCoords(targetPos);

    if (checkAdjacent(row1, row2, col1, col2)) {
      const newImagesArr = [...imagesArr];
      const currentArrIndex = newImagesArr.indexOf(currentIndex);
      const targetArrIndex = newImagesArr.indexOf(9);

      [newImagesArr[currentArrIndex], newImagesArr[targetArrIndex]] = [
        newImagesArr[targetArrIndex], 
        newImagesArr[currentArrIndex]
      ];

      setImagesArr(newImagesArr);
      setMovesCount(movesCount + 1);

      if (newImagesArr.join('') === '123456789') {
        setTimeout(() => {
          setGameState('completed');
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">Sliding Puzzle</h1>

        {gameState === 'landing' && (
          <div className="text-center">
            <button 
              onClick={startGame}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'completed') && (
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-4">
              <p className="text-xl">Moves: {movesCount}</p>
              {gameState === 'completed' && (
                <p className="text-green-600 font-bold">Puzzle Solved!</p>
              )}
            </div>

            <div 
              className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto"
              style={{ aspectRatio: '1/1' }}
            >
              {imagesArr.map((imageNum, index) => (
                <div 
                  key={index}
                  data-position={`${Math.floor(index / 3)}_${index % 3}`}
                  className={`aspect-square border rounded-lg overflow-hidden 
                    ${imageNum === 9 ? 'bg-gray-200' : 'cursor-pointer hover:opacity-80'}`}
                  onClick={() => imageNum !== 9 && selectImage(imageNum)}
                >
                  {imageNum !== 9 && (
                    <img 
                      src={`/images/image_part_00${imageNum}.jpg`}
                      alt={`Puzzle piece ${imageNum}`}
                      className="w-full h-full object-cover"
                      data-index={imageNum}
                    />
                  )}
                </div>
              ))}
            </div>

            {gameState === 'completed' && (
              <button 
                onClick={startGame}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Play Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidingPuzzle;
