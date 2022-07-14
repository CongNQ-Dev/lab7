import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  Col,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { BsPencilFill } from "react-icons/bs";
import { Loading } from "./LoadingComponent";

// class DishDetail extends Component {
//     renderDish(dish) {
//         return (
//             <div className="col-12 col-md-5 m-1">
//                 <Card>
//                     <CardImg top src={dish.image} alt={dish.name} />
//                     <CardBody>
//                         <CardTitle>{dish.name}</CardTitle>
//                         <CardText>{dish.description}</CardText>
//                     </CardBody>
//                 </Card>
//             </div>
//         );
//     }
//     renderComments(comments) {
//         if (comments != null)
//             return (
//                 <div className='text-left col-12 col-md-5 m-2'>
//                     <h3 className='mb-3'>Comments</h3>
//                     <div>
//                         {comments.map((item) => {
//                             var date = new Date(item.date);
//                             return (
//                                 <div key={item.id} className='mb-3 font-weight-bold'>
//                                     <CardText>{item.comment}</CardText>
//                                     <span>
//                                         --{item.author}, {date.toDateString()}
//                                     </span>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             );
//         else
//             return (
//                 <div></div>
//             );
//     }

//     render() {
//         if (this.props.dish != null) {
//             return (
//                 <div className="container">
//                     <div className="row">
//                         {this.renderDish(this.props.dish)}
//                         {this.renderComments(this.props.dish.comments)}
//                     </div>
//                 </div>
//             );
//         }
//         else {
//             return (
//                 <div></div>
//             );
//         }
//     }
// }

// export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }
  onClose = () => {
    this.setState({ isModalOpen: false });
  };
  handleSubmit(values) {
    this.toggleModal();
    this.props.addComment(
      this.props.dishId,
      values.rating,
      values.author,
      values.comment
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row mt-3">
          <Button outline onClick={this.toggleModal}>
            <BsPencilFill /> Submit Comment
          </Button>
          <Modal
            isOpen={this.state.isModalOpen}
            toggle={this.toggleModal}
            onClose={this.onClose}
          >
            <ModalHeader toggle={this.toggleModal}>
              <h4>Submit Comment</h4>
            </ModalHeader>
            <ModalBody>
              <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                <Row className="form-group">
                  <Col md={12}>
                    <Label htmlFor="rating">
                      <h6 className="text-secondary">Rating</h6>
                    </Label>
                    <Control.select
                      model=".rating"
                      className="form-control text-dark"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Control.select>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12}>
                    <Label htmlFor="author">
                      <h6 className="text-secondary">Your Name</h6>
                    </Label>
                    <Control.text
                      model=".author"
                      id="author"
                      name="author"
                      placeholder="Your Name"
                      className="form-control text-dark"
                      validators={{
                        required,
                        minLength: minLength(3),
                        maxLength: maxLength(15),
                      }}
                    />
                    <Errors
                      className="text-danger"
                      model=".author"
                      show="touched"
                      messages={{
                        required: "Required",
                        minLength: "Must be greater than 2 characters",
                        maxLength: "Must be 15 characters or less",
                      }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12}>
                    <Label htmlFor="comment">
                      <h6 className="text-secondary">Comment</h6>
                    </Label>
                    <Control.textarea
                      model=".comment"
                      id="comment"
                      rows="6"
                      className="form-control text-dark"
                    ></Control.textarea>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12}>
                    <Button type="submit" color="info">
                      <span className="text-light">Submit</span>
                    </Button>
                  </Col>
                </Row>
              </LocalForm>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}

function RenderDish({ dish }) {
  return (
    <div>
      <Card>
        <CardImg top src={dish.image} alt={dish.name} />
        <CardBody>
          <CardTitle>{dish.name}</CardTitle>
          <CardText>{dish.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

function RenderComments({ comments, addComment, dishId }) {
  if (comments != null) {
    return (
      <div>
        <h4 className="mb-2">Comment</h4>
        <ul className="list-unstyled">
          {comments.map((comment) => {
            return (
              <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>
                  -- {comment.author},{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(Date.parse(comment.date)))}
                </p>
              </li>
            );
          })}
        </ul>
        <CommentForm dishId={dishId} addComment={addComment} />
      </div>
    );
  } else {
    return <div></div>;
  }
}

const DishDetail = (props) => {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/home">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>Menu</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments
              comments={props.comments}
              addComment={props.addComment}
              dishId={props.dish.id}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default DishDetail;
