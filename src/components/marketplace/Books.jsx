import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddBook from "./AddBook";
import Book from "./Book";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyBookAction, createBookAction, deleteBookAction, getBooksAction, likeAction, dislikesAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Books = ({address, fetchBalance}) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // function to get list of books
    const getBooks = async () => {
        setLoading(true);
        getBooksAction()
            .then(books => {
                if (books) {
                 setBooks(books);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getBooks();
    }, []);

    const createBook = async (data) => {
        setLoading(true);
        createBookAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Book added successfully."/>);
                getBooks();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to create a book."/>);
                setLoading(false);
            })
    };

    const buyBook = async (book, count) => {
        setLoading(true);
        buyBookAction(address, book, count)
            .then(() => {
                toast(<NotificationSuccess text="Book bought successfully"/>);
                getBooks();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to purchase book."/>);
                setLoading(false);
            })
    };

    const likeBook = async (book) => {
        setLoading(true);
        likeAction(address, book)
          .then(() => {
            toast(<NotificationSuccess text="Book liked successfully" />);
            getBooks();
            fetchBalance(address);
          })
          .catch((error) => {
            console.log(error);
            toast(<NotificationError text="Failed to like book." />);
            setLoading(false);
          });
      };
    
      const dislikeBook = async (book) => {
        setLoading(true);
        dislikesAction(address, book)
          .then(() => {
            toast(<NotificationSuccess text="Book disliked successfully" />);
            getBooks();
            fetchBalance(address);
          })
          .catch((error) => {
            console.log(error);
            toast(<NotificationError text="Failed to dislike book." />);
            setLoading(false);
          });
      };

    const deleteBook = async (book) => {
        setLoading(true);
        deleteBookAction(address, book.appId)
            .then(() => {
                toast(<NotificationSuccess text="Book deleted successfully"/>);
                getBooks();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete book."/>);
                setLoading(false);
            })
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Book Centre</h1>
                <AddBook createBook={createBook}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {books.map((book, index) => (
                        <Book
                            address={address}
                            book={book}
                            buyBook={buyBook}
                            deleteBook={deleteBook}
                            likeBook={likeBook}
                            dislikeBook={dislikeBook}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Books.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Books;
