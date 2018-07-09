# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [City](#city)
    * [CityMeta](#citymeta)
    * [CityMetaObj](#citymetaobj)
    * [CityMetaPointing](#citymetapointing)
    * [MoveAction](#moveaction)
    * [MoveActionMeta](#moveactionmeta)
    * [MoveActionMetaObj](#moveactionmetaobj)
    * [MoveActionMetaPointing](#moveactionmetapointing)
    * [Person](#person)
    * [PersonMeta](#personmeta)
    * [PersonMetaObj](#personmetaobj)
    * [PersonMetaPointing](#personmetapointing)
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
    * [costProperty](#costproperty)
    * [fromCityProperty](#fromcityproperty)
    * [fromCityPropertyMetaPointing](#fromcitypropertymetapointing)
    * [isCapitalProperty](#iscapitalproperty)
    * [isMovedProperty](#ismovedproperty)
    * [latitudeProperty](#latitudeproperty)
    * [livesInProperty](#livesinproperty)
    * [livesInPropertyMetaPointing](#livesinpropertymetapointing)
    * [moveNumberProperty](#movenumberproperty)
    * [nameProperty](#nameproperty)
    * [namePropertyTopOccurrences](#namepropertytopoccurrences)
    * [personProperty](#personproperty)
    * [personPropertyMetaPointing](#personpropertymetapointing)
    * [populationProperty](#populationproperty)
    * [toCityProperty](#tocityproperty)
    * [toCityPropertyTopOccurrences](#tocitypropertytopoccurrences)
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

### City

City

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
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Official name of the city.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>latitude</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

The city's latitude

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>population</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

Number of inhabitants of the city

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isCapital</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

True if the city is a capital

</td>
</tr>
</tbody>
</table>

### CityMeta

City

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
<td valign="top"><a href="#citymetaobj">CityMetaObj</a></td>
<td>

meta information about class object

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#nameproperty">nameProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>latitude</strong></td>
<td valign="top"><a href="#latitudeproperty">latitudeProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>population</strong></td>
<td valign="top"><a href="#populationproperty">populationProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isCapital</strong></td>
<td valign="top"><a href="#iscapitalproperty">isCapitalProperty</a></td>
<td></td>
</tr>
</tbody>
</table>

### CityMetaObj

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
<td valign="top"><a href="#citymetapointing">CityMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### CityMetaPointing

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

### MoveAction

Action of buying a thing

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
<td colspan="2" valign="top"><strong>Person</strong></td>
<td valign="top"><a href="#personuniontype">PersonUnionType</a></td>
<td>

Person who moves

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>toCity</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The city the person moves to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ToCity</strong></td>
<td valign="top"><a href="#tocityuniontype">ToCityUnionType</a></td>
<td>

The city the person moves to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>FromCity</strong></td>
<td valign="top"><a href="#fromcityuniontype">FromCityUnionType</a></td>
<td>

The city the person moves from

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isMoved</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Whether the person is already moved

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>date</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The date the person is moving

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>moveNumber</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The total amount of house moves the person has made

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cost</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td>

The total costs of the movement

</td>
</tr>
</tbody>
</table>

### MoveActionMeta

Action of buying a thing

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
<td valign="top"><a href="#moveactionmetaobj">MoveActionMetaObj</a></td>
<td>

meta information about class object

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>person</strong></td>
<td valign="top"><a href="#personproperty">personProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>toCity</strong></td>
<td valign="top"><a href="#tocityproperty">toCityProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fromCity</strong></td>
<td valign="top"><a href="#fromcityproperty">fromCityProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isMoved</strong></td>
<td valign="top"><a href="#ismovedproperty">isMovedProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>date</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The date the person is moving

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>moveNumber</strong></td>
<td valign="top"><a href="#movenumberproperty">moveNumberProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cost</strong></td>
<td valign="top"><a href="#costproperty">costProperty</a></td>
<td></td>
</tr>
</tbody>
</table>

### MoveActionMetaObj

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
<td valign="top"><a href="#moveactionmetapointing">MoveActionMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### MoveActionMetaPointing

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

### Person

Person

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
<td colspan="2" valign="top"><strong>LivesIn</strong></td>
<td valign="top"><a href="#livesinuniontype">LivesInUnionType</a></td>
<td>

The city where the person lives.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>birthday</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Birthday of the person

</td>
</tr>
</tbody>
</table>

### PersonMeta

Person

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
<td valign="top"><a href="#personmetaobj">PersonMetaObj</a></td>
<td>

meta information about class object

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>livesIn</strong></td>
<td valign="top"><a href="#livesinproperty">livesInProperty</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>birthday</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Birthday of the person

</td>
</tr>
</tbody>
</table>

### PersonMetaObj

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
<td valign="top"><a href="#personmetapointing">PersonMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### PersonMetaPointing

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
<td colspan="2" valign="top"><strong>MoveAction</strong></td>
<td valign="top">[<a href="#moveaction">MoveAction</a>]</td>
<td>

Action of buying a thing

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
<td colspan="2" valign="top"><strong>City</strong></td>
<td valign="top">[<a href="#city">City</a>]</td>
<td>

City

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
<td colspan="2" valign="top"><strong>Person</strong></td>
<td valign="top">[<a href="#person">Person</a>]</td>
<td>

Person

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
<td colspan="2" valign="top"><strong>MoveAction</strong></td>
<td valign="top"><a href="#moveactionmeta">MoveActionMeta</a></td>
<td>

Action of buying a thing

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
<td colspan="2" valign="top"><strong>City</strong></td>
<td valign="top"><a href="#citymeta">CityMeta</a></td>
<td>

City

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
<td colspan="2" valign="top"><strong>Person</strong></td>
<td valign="top"><a href="#personmeta">PersonMeta</a></td>
<td>

Person

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

### costProperty

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

### fromCityProperty

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
<td valign="top"><a href="#fromcitypropertymetapointing">fromCityPropertyMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### fromCityPropertyMetaPointing

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

### isCapitalProperty

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

### isMovedProperty

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

### latitudeProperty

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

### livesInProperty

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
<td valign="top"><a href="#livesinpropertymetapointing">livesInPropertyMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### livesInPropertyMetaPointing

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

### moveNumberProperty

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

### nameProperty

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
<td valign="top"><a href="#namepropertytopoccurrences">namePropertyTopOccurrences</a></td>
<td>

most frequent property values

</td>
</tr>
</tbody>
</table>

### namePropertyTopOccurrences

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

### personProperty

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
<td valign="top"><a href="#personpropertymetapointing">personPropertyMetaPointing</a></td>
<td>

pointing to and from how many other things

</td>
</tr>
</tbody>
</table>

### personPropertyMetaPointing

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

### populationProperty

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

### toCityProperty

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
<td valign="top"><a href="#tocitypropertytopoccurrences">toCityPropertyTopOccurrences</a></td>
<td>

most frequent property values

</td>
</tr>
</tbody>
</table>

### toCityPropertyTopOccurrences

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
<td valign="top"><strong>City</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Person</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>MoveAction</strong></td>
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

