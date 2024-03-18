import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
	{
		$match: {
			product: new ObjectId('65a063302c5d67e2ed250783'),
		},
	},
	{
		$group: {
			_id: null,
			averageRating: {
				$avg: '$rating',
			},
		},
	},
];

const client = await MongoClient.connect('', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const coll = client.db('EDEN-INTERIOR').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
