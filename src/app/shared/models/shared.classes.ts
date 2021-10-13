export class HttpParameterCodec {
  encodeKey = encodeURIComponent;
  encodeValue = encodeURIComponent;
  decodeKey = decodeURIComponent;
  decodeValue = decodeURIComponent;
}
