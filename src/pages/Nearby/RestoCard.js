import React from 'react';
export default function RestoCard(props){
  return(
    <Card >
    <Card.Img variant="top" src="" />
    <Card.Body>
      <Link className="text-reset text-decoration-none" to={`/restaurant/${props.item.id}`}>
      <Card.Title >
        <h2 className="m-0 p-0">{props.item.name}</h2>
      </Card.Title>
      <Card.Text className="m-0" style={{ fontSize: 12 }}>
        {props.item.address}
      </Card.Text>
      {props.item.tags.map((tag,index) => {
        return (
          <button
          key={index}
            disabled
            className="pt-0 pb-0 border-0 mt-0"
            style={{ fontSize: 12 }}
          >
            {tag}
          </button>
        );
      })}
      <Card.Text className="">Rating: ⭐⭐⭐⭐</Card.Text>
      </Link>
      <Row>
        <Col>
          {props.item.phone && (
            <Button
              variant="secondary"
              className="pt-0 pb-0 ps-4 pe-4"
              as="a"
              href={`tel:${props.item.phone}`}
            >
              Call
            </Button>
          )}
        </Col>
        <Col>
          <Button
            style={{ float: 'right' }}
            variant="secondary"
            className="pt-0 pb-0 ps-3 pe-3"
            as="a"
            href={`https://www.swiggy.com/search?query=${props.item.name.replaceAll(
              ' ',
              '+'
            )}`}
            target="_blank"
          >
            Order online
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
  );
}