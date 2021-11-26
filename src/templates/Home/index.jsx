import { Component } from 'react';
import './styles.css';
import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts'
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';




export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 10,
    searchValue: ''
  };

  /*aqui fica o carregamentos do link que consome a API*/
  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;

    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    });

  }

  loadMorePosts = () => {
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;

    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });



  }


  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });

  }

  /*toda vez que você ver map lembra de colocar a key no primeirio elemento
    que é retornado para este map*/

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filteredPosts = !!searchValue ?
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(
          searchValue.toLowerCase()
        );
      })
      : posts;

    return (
      <section className="container">

        <div class="search-container">

          {!!searchValue && (
            <h1>Search value: {searchValue} </h1>
          )}

          <TextInput searchValue={searchValue} handleChange={this.handleChange} />

        </div>


        {filteredPosts.length > 0 && (
          <Posts posts={filteredPosts} />
        )}

        {filteredPosts.length === 0 && (
          <p>Não existem posts com este nome &#128577;</p>
        )}



        <div className="button-container">
          {!searchValue && (
            <Button
              text="Load More posts"
              onClick={this.loadMorePosts}
              disabled={noMorePosts}
            />

          )}


        </div>

      </section>
    );
  }
}

