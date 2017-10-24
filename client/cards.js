// the column objects
const columns = {
  c1: {
    count: 0,
    height: 0,
    obj: null,
  },
  c2: {
    count: 0,
    height: 0,
    obj: null,
  },
  c3: {
    count: 0,
    height: 0,
    obj: null,
  },
  c4: {
    count: 0,
    height: 0,
    obj: null,
  },
};

// basic class to hold data
class Card {
  
  constructor ( _obj) {
    this.object = _obj || null;
    this.top = 0;
    this.height = 0;
    this.imageSrc = null;
    this.ref = '';
  }
  
}

// find the document columns
const cardsInit = () => {
  columns.c1.obj = document.querySelector('#c1');
  columns.c2.obj = document.querySelector('#c2');
  columns.c3.obj = document.querySelector('#c3');
  columns.c4.obj = document.querySelector('#c4');
};

// function that parses a list of cards into new html cards
const parseCards = (cardList) => {
  const cards = JSON.parse(cardList).posts;
  const keys = Object.keys(cards);
  
  console.dir(cards);
  //console.dir(keys);
  
  // reset the columns
  columns.c1.obj.innerHTML = '';
  columns.c2.obj.innerHTML = '';
  columns.c3.obj.innerHTML = '';
  columns.c4.obj.innerHTML = '';
  
  columns.c1.height = 0;
  columns.c2.height = 0;
  columns.c3.height = 0;
  columns.c4.height = 0;
  
  columns.c1.count = 0;
  columns.c2.count = 0;
  columns.c3.count = 0;
  columns.c4.count = 0;
  
  let num = 0;
  
  // create a new card for each image and attach callbacks to append them
  for (let i = 0; i < keys.length; i++) {
    
    const c = new Card(cards[keys[i]]);
    c.image = new Image();
    c.ref = keys[i];

    c.image.src = c.object.link;
    c.image.onload = (e) => {
      // check to see if all the images have loaded yet or not
      num++;
      if (num === keys.length) {
        const refreshBox = document.querySelector('.loadBox');

        refreshBox.dataset.active = 'false';
      }
      
      // add the new card to the display
      c.imageSrc = c.image.src;
      const ratio = c.image.height / c.image.width;
      c.height = 288 * ratio;
      addCard(c);
    };
  }
};

// function to create the html needed for a new card
const htmlCard = (height, top, obj) => {
  
  const outerCard = document.createElement('div');
  outerCard.className = 'card';
  outerCard.style.top = `${top}px`;
  
  // set up the innards of the card
  const innerCard = document.createElement('div');
  innerCard.className = 'card-interior';
  innerCard.dataset.reference = obj.ref;
  outerCard.appendChild(innerCard);
  const cardImageContainer = document.createElement('div');
  cardImageContainer.className = 'card-image-container';
  const cardImage = document.createElement('img');
  cardImage.className = 'card-image';
  cardImage.src = obj.imageSrc;
  const cardInfo = document.createElement('div');
  cardInfo.className = 'card-info';
  innerCard.appendChild(cardImageContainer);
  innerCard.appendChild(cardInfo);
  cardImageContainer.appendChild(cardImage);
  
  cardImage.style.height = height;
  innerCard.style.height = height + 120;
  
  const cardTitle = document.createElement('div');
  cardTitle.className = 'card-title';
  const title = document.createElement('h4');
  title.innerHTML = obj.object.title;
  cardTitle.appendChild(title);
  
  const cardUser = document.createElement('div');
  cardUser.className = 'card-user';
  const user = document.createElement('p');
  user.innerHTML = obj.object.username;
  cardUser.appendChild(user);
  
  const cardDesc = document.createElement('div');
  cardDesc.className = 'card-desc';
  const desc = document.createElement('p');
  desc.innerHTML = obj.object.description;
  cardDesc.appendChild(desc);
  
  const cardDate = document.createElement('div');
  cardDate.className = 'card-date';
  const d = new Date(obj.object.time);
  const date = document.createElement('p');
  date.innerHTML = d.toDateString();
  cardDate.appendChild(date);
  
  // append everything
  cardInfo.appendChild(cardTitle);
  cardInfo.appendChild(cardUser);
  cardInfo.appendChild(cardDesc);
  cardInfo.appendChild(cardDate);
  
  innerCard.onclick = (e) => {updateWindow(e, obj.object)};
  
  return outerCard;
};

const addCard = (c) => {
  const newCard = c;
  const h = newCard.height;
  
  // find out which column is currently the shortest
  if (columns.c1.height <= columns.c2.height) {
    if (columns.c1.height <= columns.c3.height) {
      if (columns.c1.height <= columns.c4.height) {
        // add to the first column
        const html = htmlCard(h, columns.c1.height, newCard);

        columns.c1.obj.appendChild(html);
        columns.c1.height += h + 152;
        columns.c1.count++;
      } else {
        // add to the fourth column
        const html = htmlCard(h, columns.c4.height, newCard);

        columns.c4.obj.appendChild(html);
        columns.c4.height += h + 152;
        columns.c4.count++;
      }
    } else if (columns.c3.height <= columns.c4.height) {
      // add to the third column
      const html = htmlCard(h, columns.c3.height, newCard);

      columns.c3.obj.appendChild(html);
      columns.c3.height += h + 152;
      columns.c3.count++;
    } else {
        // add to the fourth column
        const html = htmlCard(h, columns.c4.height, newCard);

        columns.c4.obj.appendChild(html);
        columns.c4.height += h + 152;
        columns.c4.count++;
    }
  } else if (columns.c2.height <= columns.c3.height) {
    if (columns.c2.height <= columns.c4.height) {
      // add to the second column
      const html = htmlCard(h, columns.c2.height, newCard);

      columns.c2.obj.appendChild(html);
      columns.c2.height += h + 152;
      columns.c2.count++;
    } else {
      // add to the fourth column
      const html = htmlCard(h, columns.c4.height, newCard);

      columns.c4.obj.appendChild(html);
      columns.c4.height += h + 152;
      columns.c4.count++;
    }
  } else {
    if (columns.c3.height <= columns.c4.height) {
      // add to the third column
      const html = htmlCard(h, columns.c3.height, newCard);

      columns.c3.obj.appendChild(html);
      columns.c3.height += h + 152;
      columns.c3.count++;
    } else {
      // add to the fourth column
      const html = htmlCard(h, columns.c4.height, newCard);

      columns.c4.obj.appendChild(html);
      columns.c4.height += h + 152;
      columns.c4.count++;
    }
  }
  
};
