import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';


import Link from './Link'
import { graphql, gql } from 'react-apollo';


class LinkList extends Component {

  render() {
    // 1
  if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
    return <Text>Loading</Text>
  }
  // 2
  if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
    return <Text>Error</Text>
  }
  // 3
  const linksToRender = this.props.allLinksQuery.allLinks


    return (
      <View>
        {linksToRender.map(link => (
          <Link key={link.id} link={link}/>
        ))}
      </View>
    )
  }

}

//Fetch data from the backend
// 1
const ALL_LINKS_QUERY = gql`
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
    }
  }
`

// 3
export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' }) (LinkList)
