# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [ACTION1](#action1)
    * [ACTION1Meta](#action1meta)
    * [ACTION1MetaObj](#action1metaobj)
    * [ACTION1MetaPointing](#action1metapointing)
    * [ACTION1_PROP1Property](#action1_prop1property)
    * [ACTION1_PROP1PropertyMetaPointing](#action1_prop1propertymetapointing)
    * [ACTION1_PROP2Property](#action1_prop2property)
    * [ACTION1_PROP2PropertyTopOccurrences](#action1_prop2propertytopoccurrences)
    * [THING1](#thing1)
    * [THING1Meta](#thing1meta)
    * [THING1MetaObj](#thing1metaobj)
    * [THING1MetaPointing](#thing1metapointing)
    * [THING1_PROP1Property](#thing1_prop1property)
    * [THING1_PROP1PropertyTopOccurrences](#thing1_prop1propertytopoccurrences)
    * [THING1_PROP2Property](#thing1_prop2property)
    * [THING1_PROP3Property](#thing1_prop3property)
    * [THING1_PROP4Property](#thing1_prop4property)
    * [THING2](#thing2)
    * [THING2Meta](#thing2meta)
    * [THING2MetaObj](#thing2metaobj)
    * [THING2MetaPointing](#thing2metapointing)
    * [THING2_PROP1Property](#thing2_prop1property)
    * [THING2_PROP1PropertyMetaPointing](#thing2_prop1propertymetapointing)
    * [WeaviateLocalConvertedFetchActionsObj](#weaviatelocalconvertedfetchactionsobj)
    * [WeaviateLocalConvertedFetchObj](#weaviatelocalconvertedfetchobj)
    * [WeaviateLocalConvertedFetchThingsObj](#weaviatelocalconvertedfetchthingsobj)
    * [WeaviateLocalHelpersFetchObj](#weaviatelocalhelpersfetchobj)
    * [WeaviateLocalHelpersFetchPinPointObj](#weaviatelocalhelpersfetchpinpointobj)
    * [WeaviateLocalMetaFetchGenericsActionObj](#weaviatelocalmetafetchgenericsactionobj)
    * [WeaviateLocalMetaFetchGenericsObj](#weaviatelocalmetafetchgenericsobj)
    * [WeaviateLocalMetaFetchGenericsThingObj](#weaviatelocalmetafetchgenericsthingobj)
    * [WeaviateLocalMetaFetchObj](#weaviatelocalmetafetchobj)
    * [WeaviateLocalObj](#weaviatelocalobj)
    * [WeaviateNetworkObj](#weaviatenetworkobj)
  * [Enums](#enums)
    * [WeaviateLocalHelpersFetchPinPointSearchTypeEnum](#weaviatelocalhelpersfetchpinpointsearchtypeenum)
    * [WeaviateLocalHelpersFetchPinPointStackEnum](#weaviatelocalhelpersfetchpinpointstackenum)
    * [classEnum](#classenum)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Float](#float)
    * [ID](#id)
    * [Int](#int)
    * [String](#string)

</details>

## Query (WeaviateObj)
Location of the root query

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>Local</strong></td>
<td valign="top"><a href="#weaviatelocalobj">WeaviateLocalObj</a></td>
<td>

Locate on the local Weaviate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>Network</strong></td>
<td valign="top"><a href="#weaviatenetworkobj">WeaviateNetworkObj</a></td>
<td>

Locate on the Weaviate network

</td>
</tr>
</tbody>
</table>

## Objects

### ACTION1

DESCRIPTION ACTION1

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ACTION1_PROP1</strong></td>
<td valign="top"><a href="#action1_prop1uniontype">ACTION1_PROP1UnionType</a></td>
<td>

DESCRIPTION ACTION1_PROP1

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ACTION1_PROP2</strong></td>
<td valign="top"><a href="#action1_prop2uniontype">ACTION1_PROP2UnionType</a></td>
<td>

DESCRIPTION ACTION1_PROP2

</td>
</tr>
</tbody>
</table>

### ACTION1Meta

DESCRIPTION ACTION1

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#action1metaobj">ACTION1MetaObj</a></td>
<td>

meta information about class object

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ACTION1_PROP1</strong></td>
<td valign="top"><a href="#action1_prop1property">ACTION1_PROP1Property</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ACTION1_PROP2</strong></td>
<td valign="top"><a href="#action1_prop2property">ACTION1_PROP2Property</a></td>
<td></td>
</tr>
</tbody>
</table>

### ACTION1MetaObj

meta information about class object

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many class instances are there

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pointing</strong></td>
<td valign="top"><a href="#action1metapointing">ACTION1MetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### ACTION1MetaPointing

pointing to and from how many other things

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>to</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing from

</td>
</tr>
</tbody>
</table>

### ACTION1_PROP1Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pointing</strong></td>
<td valign="top"><a href="#action1_prop1propertymetapointing">ACTION1_PROP1PropertyMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### ACTION1_PROP1PropertyMetaPointing

pointing to and from how many other things

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>to</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing from

</td>
</tr>
</tbody>
</table>

### ACTION1_PROP2Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topOccurrences</strong></td>
<td valign="top"><a href="#action1_prop2propertytopoccurrences">ACTION1_PROP2PropertyTopOccurrences</a></td>
<td>

most frequent property values

</td>
</tr>
</tbody>
</table>

### ACTION1_PROP2PropertyTopOccurrences

most frequent property values

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

property value of the most frequent properties

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>occurs</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

number of occurrance

</td>
</tr>
</tbody>
</table>

### THING1

DESCRIPTION THING 1

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP1</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

DESCRIPTION THING1_PROP1

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP2</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

DESCRIPTION THING1_PROP1

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP3</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

DESCRIPTION THING1_PROP1

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP4</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

DESCRIPTION THING1_PROP1

</td>
</tr>
</tbody>
</table>

### THING1Meta

DESCRIPTION THING 1

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#thing1metaobj">THING1MetaObj</a></td>
<td>

meta information about class object

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP1</strong></td>
<td valign="top"><a href="#thing1_prop1property">THING1_PROP1Property</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP2</strong></td>
<td valign="top"><a href="#thing1_prop2property">THING1_PROP2Property</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP3</strong></td>
<td valign="top"><a href="#thing1_prop3property">THING1_PROP3Property</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING1_PROP4</strong></td>
<td valign="top"><a href="#thing1_prop4property">THING1_PROP4Property</a></td>
<td></td>
</tr>
</tbody>
</table>

### THING1MetaObj

meta information about class object

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many class instances are there

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pointing</strong></td>
<td valign="top"><a href="#thing1metapointing">THING1MetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### THING1MetaPointing

pointing to and from how many other things

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>to</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing from

</td>
</tr>
</tbody>
</table>

### THING1_PROP1Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>topOccurrences</strong></td>
<td valign="top"><a href="#thing1_prop1propertytopoccurrences">THING1_PROP1PropertyTopOccurrences</a></td>
<td>

most frequent property values

</td>
</tr>
</tbody>
</table>

### THING1_PROP1PropertyTopOccurrences

most frequent property values

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

property value of the most frequent properties

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>occurs</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

number of occurrance

</td>
</tr>
</tbody>
</table>

### THING1_PROP2Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lowest</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

Lowest value occurrence

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>highest</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

Highest value occurrence

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>average</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

average number

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

sum of values of found instances

</td>
</tr>
</tbody>
</table>

### THING1_PROP3Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lowest</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

Lowest value occurrence

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>highest</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

Highest value occurrence

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>average</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

average number

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sum</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

sum of values of found instances

</td>
</tr>
</tbody>
</table>

### THING1_PROP4Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>total_true</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of boolean value is true

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>percentage_true</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

percentage of boolean = true

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
</tbody>
</table>

### THING2

DESCRIPTION THING2

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>THING2_PROP1</strong></td>
<td valign="top"><a href="#thing2_prop1uniontype">THING2_PROP1UnionType</a></td>
<td>

DESCRIPTION THING2_PROP1

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING2_PROP2</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

DESCRIPTION THING2_PROP2

</td>
</tr>
</tbody>
</table>

### THING2Meta

DESCRIPTION THING2

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#thing2metaobj">THING2MetaObj</a></td>
<td>

meta information about class object

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING2_PROP1</strong></td>
<td valign="top"><a href="#thing2_prop1property">THING2_PROP1Property</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING2_PROP2</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

DESCRIPTION THING2_PROP2

</td>
</tr>
</tbody>
</table>

### THING2MetaObj

meta information about class object

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many class instances are there

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pointing</strong></td>
<td valign="top"><a href="#thing2metapointing">THING2MetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### THING2MetaPointing

pointing to and from how many other things

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>to</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing from

</td>
</tr>
</tbody>
</table>

### THING2_PROP1Property

Property meta information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

datatype of the property

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>counter</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

total amount of found instances

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pointing</strong></td>
<td valign="top"><a href="#thing2_prop1propertymetapointing">THING2_PROP1PropertyMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### THING2_PROP1PropertyMetaPointing

pointing to and from how many other things

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>to</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>from</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

how many other classes the class is pointing from

</td>
</tr>
</tbody>
</table>

### WeaviateLocalConvertedFetchActionsObj

Fetch Actions on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ACTION1</strong></td>
<td valign="top">[<a href="#action1">ACTION1</a>]</td>
<td>

DESCRIPTION ACTION1

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_certainty</td>
<td valign="top"><a href="#float">Float</a></td>
<td>

How certain about these values?

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the max returned values.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the amount of values to skip.

</td>
</tr>
</tbody>
</table>

### WeaviateLocalConvertedFetchObj

Fetch things or actions on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>Things</strong></td>
<td valign="top"><a href="#weaviatelocalconvertedfetchthingsobj">WeaviateLocalConvertedFetchThingsObj</a></td>
<td>

Locate Things on the local Weaviate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>Actions</strong></td>
<td valign="top"><a href="#weaviatelocalconvertedfetchactionsobj">WeaviateLocalConvertedFetchActionsObj</a></td>
<td>

Locate Actions on the local Weaviate

</td>
</tr>
</tbody>
</table>

### WeaviateLocalConvertedFetchThingsObj

Fetch things on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>THING1</strong></td>
<td valign="top">[<a href="#thing1">THING1</a>]</td>
<td>

DESCRIPTION THING 1

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_certainty</td>
<td valign="top"><a href="#float">Float</a></td>
<td>

How certain about these values?

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the max returned values.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the amount of values to skip.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING2</strong></td>
<td valign="top">[<a href="#thing2">THING2</a>]</td>
<td>

DESCRIPTION THING2

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_certainty</td>
<td valign="top"><a href="#float">Float</a></td>
<td>

How certain about these values?

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the max returned values.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the amount of values to skip.

</td>
</tr>
</tbody>
</table>

### WeaviateLocalHelpersFetchObj

Fetch things or actions on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>PinPoint</strong></td>
<td valign="top"><a href="#weaviatelocalhelpersfetchpinpointobj">WeaviateLocalHelpersFetchPinPointObj</a></td>
<td>

Find a set of exact ID's of Things or Actions on the local Weaviate

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_stack</td>
<td valign="top"><a href="#weaviatelocalhelpersfetchpinpointstackenum">WeaviateLocalHelpersFetchPinPointStackEnum</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_classes</td>
<td valign="top">[<a href="#classenum">classEnum</a>]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_properties</td>
<td valign="top">[<a href="#string">String</a>]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_needle</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_searchType</td>
<td valign="top"><a href="#weaviatelocalhelpersfetchpinpointsearchtypeenum">WeaviateLocalHelpersFetchPinPointSearchTypeEnum</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

### WeaviateLocalHelpersFetchPinPointObj

Fetch uuid of Things or Actions on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>uuid</strong></td>
<td valign="top"><a href="#id">ID</a></td>
<td>

Do a fuzzy search fetch to search Things or Actions on the network weaviate

</td>
</tr>
</tbody>
</table>

### WeaviateLocalMetaFetchGenericsActionObj

Action to fetch for meta generic fetch

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ACTION1</strong></td>
<td valign="top"><a href="#action1meta">ACTION1Meta</a></td>
<td>

DESCRIPTION ACTION1

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_certainty</td>
<td valign="top"><a href="#float">Float</a></td>
<td>

How certain about these values?

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the max returned values.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the amount of values to skip.

</td>
</tr>
</tbody>
</table>

### WeaviateLocalMetaFetchGenericsObj

Object type to fetch

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>Things</strong></td>
<td valign="top"><a href="#weaviatelocalmetafetchgenericsthingobj">WeaviateLocalMetaFetchGenericsThingObj</a></td>
<td>

Thing to fetch for meta generic fetch

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_maxArraySize</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>Actions</strong></td>
<td valign="top"><a href="#weaviatelocalmetafetchgenericsactionobj">WeaviateLocalMetaFetchGenericsActionObj</a></td>
<td>

Action to fetch for meta generic fetch

</td>
</tr>
</tbody>
</table>

### WeaviateLocalMetaFetchGenericsThingObj

Thing to fetch for meta generic fetch

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>THING1</strong></td>
<td valign="top"><a href="#thing1meta">THING1Meta</a></td>
<td>

DESCRIPTION THING 1

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_certainty</td>
<td valign="top"><a href="#float">Float</a></td>
<td>

How certain about these values?

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the max returned values.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the amount of values to skip.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>THING2</strong></td>
<td valign="top"><a href="#thing2meta">THING2Meta</a></td>
<td>

DESCRIPTION THING2

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_certainty</td>
<td valign="top"><a href="#float">Float</a></td>
<td>

How certain about these values?

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the max returned values.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

define the amount of values to skip.

</td>
</tr>
</tbody>
</table>

### WeaviateLocalMetaFetchObj

Fetch things or actions on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>Generics</strong></td>
<td valign="top"><a href="#weaviatelocalmetafetchgenericsobj">WeaviateLocalMetaFetchGenericsObj</a></td>
<td>

Fetch generic meta information based on the type

</td>
</tr>
</tbody>
</table>

### WeaviateLocalObj

Type of fetch on the internal Weaviate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ConvertedFetch</strong></td>
<td valign="top"><a href="#weaviatelocalconvertedfetchobj">WeaviateLocalConvertedFetchObj</a></td>
<td>

Do a converted fetch to search Things or Actions on the local weaviate

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_filter</td>
<td valign="top"><a href="#weaviatelocalconvertedfetchfilter">WeaviateLocalConvertedFetchFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>HelpersFetch</strong></td>
<td valign="top"><a href="#weaviatelocalhelpersfetchobj">WeaviateLocalHelpersFetchObj</a></td>
<td>

Do a helpers fetch to search Things or Actions on the local weaviate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>MetaFetch</strong></td>
<td valign="top"><a href="#weaviatelocalmetafetchobj">WeaviateLocalMetaFetchObj</a></td>
<td>

Fetch meta infromation about Things or Actions on the local weaviate

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">_filter</td>
<td valign="top"><a href="#weaviatelocalmetafetchfilter">WeaviateLocalMetaFetchFilter</a></td>
<td></td>
</tr>
</tbody>
</table>

### WeaviateNetworkObj

Type of fetch on the Weaviate network

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>FuzzyFetch</strong></td>
<td valign="top">[<a href="#string">String</a>]</td>
<td>

Do a fuzzy search fetch to search Things or Actions on the network weaviate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>HelpersFetch</strong></td>
<td valign="top">[<a href="#string">String</a>]</td>
<td>

Do a fetch with help to search Things or Actions on the network weaviate

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>MetaFetch</strong></td>
<td valign="top">[<a href="#string">String</a>]</td>
<td>

To fetch meta information Things or Actions on the network weaviate

</td>
</tr>
</tbody>
</table>

## Enums

### WeaviateLocalHelpersFetchPinPointSearchTypeEnum

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>standard</strong></td>
<td></td>
</tr>
</tbody>
</table>

### WeaviateLocalHelpersFetchPinPointStackEnum

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>Things</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Actions</strong></td>
<td></td>
</tr>
</tbody>
</table>

### classEnum

enum type which denote the classes

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>THING1</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>THING2</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>ACTION1</strong></td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). 

### ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

