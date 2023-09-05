     const booklist = document.getElementById('booklist');
    const form = document.querySelector('form');

    // Fetch all books on pages load
    fetch('/books')
      .then(response => response.json())
      .then(books => {
        // Clear the booklist table
        booklist.innerHTML = '';

        // Add each book to the table
        books.forEach(book => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td><button class="edit" data-id="${book._id}">Edit</button></td>
            <td><button class="delete" data-id="${book._id}">Delete</button></td>
          `;
          booklist.appendChild(row);
        });
      })
      .catch(error => console.error(error));

    // Add event listener for the Add Book form submission
    form.addEventListener('submit', event => {
      event.preventDefault();

      const title = document.getElementById('title').value;
      const author = document.getElementById('author').value;
      const pages = parseInt(document.getElementById('pages').value);

      const book = {
        title,
        author,
        pages,
      };

      // Send a POST request to the server to add the book to the database
      fetch('/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
        .then(response => response.json())
        .then(result => {
          console.log(result);
          location.reload();
        })
        .catch(error => console.error(error));
    });

// Add event listener for Edit and Delete button clicks
booklist.addEventListener('click', event => {
if (event.target.classList.contains('edit')) {
  const bookId = event.target.getAttribute('data-id');

  // Prompt the user for new values for the book
  const title = prompt('Enter new title:');
  const author = prompt('Enter new author:');
  const pages = prompt('Enter new pages:');

  const updates = {};

    if (title !== null && title !== '') {
      updates.title = title;
    }

    if (author !== null && author !== '') {
      updates.author = author;
    }

    if (pages !== null && pages !== '') {
      updates.pages = pages;
    }

  // Send a PATCH request to the server to update the book in the database
  fetch(`/books/${bookId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      location.reload();
    })
    .catch(error => console.error(error));
} else if (event.target.classList.contains('delete')) {
  const bookId = event.target.getAttribute('data-id');

  // Get the book to be deleted
  const bookToDelete = {
    title: event.target.parentNode.parentNode.childNodes[1].textContent,
    author: event.target.parentNode.parentNode.childNodes[3].textContent,
    pages: event.target.parentNode.parentNode.childNodes[5].textContent.toString(),
  };
  //const confirmed = confirm(`Are you sure you want to delete the book?\nTitle: ${bookToDelete.title}\nAuthor: ${bookToDelete.author}\nPages: ${bookToDelete.pages}`);

//if (confirmed)

  // Send a DELETE request to the server to delete the book from the database
  fetch(`/books/${bookId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      //alert(`Book deleted \nTitle: ${bookToDelete.title} \nAuthor: ${bookToDelete.author} \nPages: ${bookToDelete.pages}`);
      location.reload();

    })
    .catch(error => console.error(error));
}
});
