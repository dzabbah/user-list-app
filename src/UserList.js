import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [listOfUser, setListOfUser] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setListOfUser(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Erreur lors de la récupération des utilisateurs');
        setLoading(false);
      });
  }, []);

  // Filtrer les utilisateurs en fonction du nom
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = listOfUser.filter(user =>
      user.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Trier les utilisateurs par nom
  const sortUsers = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredUsers(sortedUsers);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Liste des utilisateurs</h1>

      {/* Barre de recherche */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Bouton de tri */}
      <button onClick={sortUsers}>Trier par nom</button>

      {/* Liste des utilisateurs */}
      <ul>
        {currentUsers.map((user) => (
          <li key={user.id}>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Ville: {user.address.city}</p>
            <button onClick={() => alert(`Voir les détails de ${user.name}`)}>
              Voir les détails
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
