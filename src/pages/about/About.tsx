import React, { FunctionComponent } from 'react'

interface AboutProps {
  name: string
}

const About: FunctionComponent<AboutProps> = ({ name }) => (
  <div>
    {name}
  </div>
)

export async function getStaticProps() {

  return {
    props: {
      name: 'Luiz'
    }
  }
}

export default About
